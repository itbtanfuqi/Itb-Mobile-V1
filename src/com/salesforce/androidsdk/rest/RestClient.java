/*
 * Copyright (c) 2011, salesforce.com, inc.
 * All rights reserved.
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * - Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * - Neither the name of salesforce.com, inc. nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission of salesforce.com, inc.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
package com.salesforce.androidsdk.rest;

import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;

import android.os.AsyncTask;

import com.salesforce.androidsdk.auth.HttpAccess;
import com.salesforce.androidsdk.auth.HttpAccess.Execution;
import com.salesforce.androidsdk.rest.RestRequest.RestMethod;

/**
 * RestClient allows you to send authenticated HTTP requests to a force.com server.
 */
public class RestClient {

	private final ClientInfo clientInfo;
	private final AuthTokenProvider authTokenProvider;
	private HttpAccess httpAccessor;
	private String authToken;
	
	/** 
	 * AuthTokenProvider interface.
	 * RestClient will call its authTokenProvider to refresh its authToken once it has expired. 
	 */
	public interface AuthTokenProvider {
		String getNewAuthToken();
		String getRefreshToken();
		long getLastRefreshTime();
	}
	
	/**
	 * AsyncRequestCallback interface.
	 * Interface through which the result of an asynchronous request is handled.
	 */
	public interface AsyncRequestCallback {
		void onSuccess(RestResponse response);
		void onError(Exception exception);
	}
	
    /**
     * Constructs a RestClient with the given clientInfo, authToken, httpAccessor and authTokenProvider.
     * When it gets a 401 (not authorized) response from the server:
     * <ul>
     * <li> If authTokenProvider is not null, it will ask the authTokenProvider for a new access token and retry the request a second time.</li>
     * <li> Otherwise it will return the 401 response.</li>
     * </ul>
	 * @param clientInfo
     * @param authToken
     * @param httpAccessor
     * @param authTokenProvider
	 */
	public RestClient(ClientInfo clientInfo, String authToken, HttpAccess httpAccessor, AuthTokenProvider authTokenProvider) {
		this.clientInfo = clientInfo;
		this.authToken = authToken;
		this.httpAccessor = httpAccessor;
		this.authTokenProvider = authTokenProvider;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("RestClient: {\n")
		  .append(clientInfo)
		  // Un-comment if you must: tokens should not be printed to the log
		  // .append("   authToken: ").append(authToken).append("\n")
		  // .append("   refreshToken: ").append(getRefreshToken()).append("\n")
		  .append("   timeSinceLastRefresh: ").append(getElapsedTimeSinceLastRefresh()).append("\n")
		  .append("}\n");
		return sb.toString();
	}
	
	/**
	 * @return The authToken for this RestClient.
	 */
	public synchronized String getAuthToken() {
		return authToken;
	}
	
	/**
	 * Change authToken for this RestClient
	 * @param newAuthToken
	 */
	private synchronized void setAuthToken(String newAuthToken) {
		authToken = newAuthToken;
	}

	/**
	 * @return The refresh token, if available.
	 */
	public String getRefreshToken() {
		return (authTokenProvider != null ? authTokenProvider.getRefreshToken() : null);
	}
	
	/**
	 * @return The client info.
	 */
	public ClientInfo getClientInfo() {
		return clientInfo;
	}
	
	/**
	 * @return Elapsed time (ms) since the last refresh.
	 */
	public long getElapsedTimeSinceLastRefresh() {
		long lastRefreshTime = (authTokenProvider != null ? authTokenProvider.getLastRefreshTime() : -1);
		if (lastRefreshTime < 0) {
			return -1;
		}
		else {
			return System.currentTimeMillis() - lastRefreshTime;
		}
	}

	/**
	 * Send the given restRequest and process the result asynchronously with the given callback.
	 * Note: Intended to be used by code on the UI thread.
	 * @param restRequest
	 * @param callback
	 */
	public void sendAsync(RestRequest restRequest, AsyncRequestCallback callback) {
		new RestCallTask(callback).execute(restRequest);
	}

	/**
	 * Send the given restRequest synchronously and return a RestResponse
	 * Note: Cannot be used by code on the UI thread (use sendAsync instead).
	 * @param restRequest
	 * @return
	 * @throws IOException 
	 */
	public RestResponse sendSync(RestRequest restRequest) throws IOException {
		return sendSync(restRequest.getMethod(), restRequest.getPath(), restRequest.getRequestEntity());
	}

	/**
	 * Send an arbitrary HTTP request synchronously, using the given method, path and httpEntity.
	 * Note: Cannot be used by code on the UI thread (use sendAsync instead).
	 * @param method
	 * @param path
	 * @param httpEntity
	 * @return
	 * @throws IOException
	 */
	public RestResponse sendSync(RestMethod method, String path, HttpEntity httpEntity) throws IOException {
		return sendSync(method, path, httpEntity, true);
	}
	
	private RestResponse sendSync(RestMethod method, String path, HttpEntity httpEntity, boolean retryInvalidToken) throws IOException {
		Execution exec = null;

		// Prepare headers
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json");
		if (getAuthToken() != null) {
			headers.put("Authorization", "OAuth " + authToken);
		}

		// Do the actual call
		switch(method) {
		case DELETE:
			exec = httpAccessor.doDelete(headers, clientInfo.instanceUrl.resolve(path)); break;
		case GET:
			exec = httpAccessor.doGet(headers, clientInfo.instanceUrl.resolve(path)); break;
		case HEAD:
			exec = httpAccessor.doHead(headers, clientInfo.instanceUrl.resolve(path)); break;
		case PATCH:
			exec = httpAccessor.doPatch(headers, clientInfo.instanceUrl.resolve(path), httpEntity); break;
		case POST:
			exec = httpAccessor.doPost(headers, clientInfo.instanceUrl.resolve(path), httpEntity); break;
		case PUT:
			exec = httpAccessor.doPut(headers, clientInfo.instanceUrl.resolve(path), httpEntity); break;
		}

		// Build response object
		RestResponse restResponse = new RestResponse(exec.response);
		
		int statusCode = restResponse.getStatusCode();

		// 401 bad access token *
		if (statusCode == HttpStatus.SC_UNAUTHORIZED) {
			// If we haven't retried already and we have an accessTokeProvider
			// Then let's try to get a new authToken
			if (retryInvalidToken && authTokenProvider != null) {
				String newAuthToken = authTokenProvider.getNewAuthToken();
				if (newAuthToken != null) {
					setAuthToken(newAuthToken);
					// Retry with the new authToken
					return sendSync(method, path, httpEntity, false);
				}
			}
		}
		
		// Done
		return restResponse;
	}
	
	/**
	 * Async task used to send request asynchronously
	 */
	private class RestCallTask extends
			AsyncTask<RestRequest, Void, RestResponse> {

		private Exception exceptionThrown = null;
		private AsyncRequestCallback callback;

		public RestCallTask(AsyncRequestCallback callback) {
			this.callback = callback;
		}
		
		@Override
		protected RestResponse doInBackground(RestRequest... requests) {
			try {
				return sendSync(requests[0]);
			} catch (Exception e) {
				exceptionThrown = e;
				return null;
			}
		}

		@Override
		protected void onPostExecute(RestResponse result) {
			if (exceptionThrown != null) {
				callback.onError(exceptionThrown);
			}
			else {
				callback.onSuccess(result);
			}
		}
	}
	
	
	/**
	 * Only used in tests
	 * @param httpAccessor
	 */
	public void setHttpAccessor(HttpAccess httpAccessor) {
		this.httpAccessor = httpAccessor; 
	}
	
	/**
	 * All immutable information for an authenticated client (e.g. username, org ID, etc.).
	 */
	public static class ClientInfo {
		public final String clientId;
		public final URI instanceUrl;
		public final URI loginUrl;
		public  final String accountName;
		public final String username;
		public final String userId;
		public final String orgId;
		
		public ClientInfo(String clientId, URI instanceUrl, URI loginUrl, String accountName, String username, String userId, String orgId) {
			this.clientId = clientId;
			this.instanceUrl = instanceUrl;
			this.loginUrl = loginUrl;
			this.accountName = accountName;
			this.username = username;
			this.userId = userId;
			this.orgId = orgId;
		}
		
		public String toString() {
			StringBuilder sb = new StringBuilder();
			sb.append("  ClientInfo: {\n")
			  .append("     loginUrl: ").append(loginUrl.toString()).append("\n")
			  .append("     instanceUrl: ").append(instanceUrl.toString()).append("\n")
			  .append("     accountName: ").append(accountName).append("\n")
			  .append("     username: ").append(username).append("\n")
			  .append("     userId: ").append(userId).append("\n")
			  .append("     orgId: ").append(orgId).append("\n")
			  .append("  }\n");
			return sb.toString();
		}
	}
}