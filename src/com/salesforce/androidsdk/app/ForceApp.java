package com.salesforce.androidsdk.app;

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

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import android.accounts.AccountManagerCallback;
import android.accounts.AccountManagerFuture;
import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Build;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;

import com.salesforce.androidsdk.auth.HttpAccess;
import com.salesforce.androidsdk.rest.ClientManager;
import com.salesforce.androidsdk.security.Encryptor;
import com.salesforce.androidsdk.security.PasscodeManager;
import com.salesforce.androidsdk.security.PasscodeManager.HashConfig;
import com.salesforce.androidsdk.ui.SalesforceR;
import com.salesforce.androidsdk.util.EventsObservable;
import com.salesforce.androidsdk.util.EventsObservable.EventType;

/**
 * Super class for all force applications.
 * You should extend this class or make sure to initialize HttpAccess in your application's onCreate method.
 */
public abstract class ForceApp extends Application {

	/**
	 * Current version of this SDK.
	 */
    public static final String SDK_VERSION = "1.0.5";

	/**
     * Instance of the ForceApp to use for this process.
     */
    public static ForceApp APP;
    
    // passcode manager
    private PasscodeManager passcodeManager;
    
    @Override
    public void onCreate() {
        super.onCreate();

        // Initialize encryption module
        Encryptor.init(this);
        
        // Initialize the http client        
        HttpAccess.init(this, getUserAgent());
        
		// Done
        APP = this;
        EventsObservable.get().notifyEvent(EventType.AppCreateComplete);
    }
    
	/**
	 * @return The passcode manager associated with the app.
	 */
	public synchronized PasscodeManager getPasscodeManager() {
		// Only creating passcode manager if used
		if (passcodeManager == null) {
			passcodeManager = new PasscodeManager(this, getLockTimeoutMinutes(),
					getVerificationHashConfig(),
					getEncryptionHashConfig());
		}
		return passcodeManager;
	}

	/**
	 * @return The hashed passcode, or null if it's not required.
	 */
	public String getPasscodeHash() {
		return passcodeManager == null ? null : passcodeManager.getPasscodeHash();
	}
	
	
	/**
	 * @return The name of the application (as defined in AndroidManifest.xml).
	 */
	public String getApplicationName() {
		return getPackageManager().getApplicationLabel(getApplicationInfo()).toString();
	}
	
    /**
     * @return Hash salts and key to use for creating the hash of the passcode used for encryption.
	 * Unique for installation.
     */
    protected HashConfig getEncryptionHashConfig() {
		return new HashConfig(getUuId("eprefix"), getUuId("esuffix"), getUuId("ekey"));
	}

    /**
     * @return The hash salt and key to use for creating the hash of the passcode used for verification.
     * Unique to the installation.
     */
	protected HashConfig getVerificationHashConfig() {
		return new HashConfig(getUuId("vprefix"), getUuId("vsuffix"), getUuId("vkey"));
	}
	
	/**
     * Wipe out the stored authentication credentials (remove account) and restart the app.
     */
    public void logout(Activity frontActivity) {
    	// Finish front activity if specified
    	if (frontActivity != null) {
    		frontActivity.finish();
    	}
    	
    	// Remove account if any
    	ClientManager clientMgr = new ClientManager(this, getAccountType(), null/* we are not doing any login*/);
    	clientMgr.removeAccountAsync(new AccountManagerCallback<Boolean>() {
			
			@Override
			public void run(AccountManagerFuture<Boolean> arg0) {
		        // Clear cookies 
		        CookieSyncManager.createInstance(ForceApp.this);
		        CookieManager.getInstance().removeAllCookie();
		    	
		        // Restart application
		        Intent i = new Intent(ForceApp.this, getMainActivityClass());
		        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		        startActivity(i);
			}
		});
    }
    
	/**
	 * Set a user agent string based on the mobile SDK version. We are building
	 * a user agent of the form: SalesforceMobileSDK/<salesforceSDK version>
	 * android/<android OS version> appName/appVersion
	 * 
	 * @return The user agent string to use for all requests.
	 */
	public final String getUserAgent() {
		String appName = "";
		String appVersion = "";
		try {
			PackageInfo packageInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
			appName = getString(packageInfo.applicationInfo.labelRes);
	    	appVersion = packageInfo.versionName;
		} 
		catch (NameNotFoundException e) {
			Log.w("ForceApp:getUserAgent", e);
		}

		return String.format("SalesforceMobileSDK/%s android mobile/%s (%s) %s/%s", SDK_VERSION, Build.VERSION.RELEASE, Build.MODEL, appName, appVersion);
	}

    /**
     * @return The authentication account type (should match authenticator.xml).
     */
	public String getAccountType() {
		return getString(getSalesforceR().stringAccountType());
	}
	
	@Override
    public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(this.getClass()).append(": {\n")
		  .append("   accountType: ").append(getAccountType()).append("\n")
		  .append("   userAgent: ").append(getUserAgent()).append("\n")
		  .append("   mainActivityClass: ").append(getMainActivityClass()).append("\n")
		  .append("   isFileSystemEncrypted: ").append(Encryptor.isFileSystemEncrypted()).append("\n")
		  .append("   lockTimeoutMinutes: ").append(getLockTimeoutMinutes()).append("\n");

		if (null != passcodeManager) {
			//passcodeManager may be null at startup if the app is running in debug mode
		  sb.append("   hasStoredPasscode: ").append(passcodeManager.hasStoredPasscode(this)).append("\n");
		}
		
		sb.append("}\n");
		
		return sb.toString();

    }
    
	/*
	 * Random keys persisted encrypted in a private preference file
	 * This is provided as an example.
	 * We recommend you provide you own implementation for creating the HashConfig's.
	 * 
	 */
	private Map<String, String> uuids = new HashMap<String, String>();
	private synchronized String getUuId(String name) {
		if (uuids.get(name) != null) return uuids.get(name);
		SharedPreferences sp = getSharedPreferences("uuids", Context.MODE_PRIVATE);
		if (!sp.contains(name)) {
			String uuid = UUID.randomUUID().toString();
			Editor e = sp.edit();
			e.putString(name, Encryptor.encrypt(uuid, getKey(name)));
			e.commit();
		}
		return Encryptor.decrypt(sp.getString(name, null), getKey(name));
	}

	
	
	/**************************************************************************************************
	 * 
	 * Abstract methods: to be implemented by subclass
	 * 
	 **************************************************************************************************/
    
    /**
	 * Note: If you return 0, the user will not have to enter a passcode.
	 * @return The lock timeout in minutes, or 0 for never.
	 *  
	 */
	public abstract int getLockTimeoutMinutes();
	
    /**
     * @return The class for the main activity.
     */
	public abstract Class<? extends Activity> getMainActivityClass();
	
    /**
     * @return SalesforceR object which allows reference to resources living outside the SDK.
     */
    public abstract SalesforceR getSalesforceR();
	
	/**
	 * This function must return the same value for name even when the application is restarted.
	 * @param name The name associated with they key.
	 * @return The key used for encrypting salts and keys.
	 */
    protected abstract String getKey(String name);

}

