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
package com.salesforce.androidsdk.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;

import com.itb.newdemo.twitterLoginActivity;
import com.phonegap.DroidGap;
import com.salesforce.androidsdk.app.ForceApp;
import com.salesforce.androidsdk.phonegap.SalesforceOAuthPlugin;

/**
 * Class that defines the main activity for a PhoneGap-based application.
 */
public class SalesforceDroidGapCustomActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    	//ensure we have a CookieSyncManager
    	CookieSyncManager.createInstance(this);
        
        //ensure that we allow urls from all salesforce domains to be loaded
        this.addWhiteListEntry("force.com", true);
        this.addWhiteListEntry("salesforce.com", true);
        
        // Load bootstrap
        super.loadUrl("file:///android_asset/www/bootstrap.html");
    }
    
    @Override
    public void init() {
    	super.init();
		final String uaStr = ForceApp.APP.getUserAgent();
		if (null != this.appView) {
	        WebSettings webSettings = this.appView.getSettings();
	        //webSettings.setUserAgentString(uaStr);
	        //this.appView.setWebViewClient(new MyWebViewClient());
	        //by fuqi
	        //MyClass android=new MyClass(this);
	        //this.appView.addJavascriptInterface(android, "twitter");
		}
    }
    
    @Override
    public void onResume() {
    	CookieSyncManager.getInstance().startSync();
    	SalesforceOAuthPlugin.autoRefreshIfNeeded(appView, this);
    	super.onResume();
    }
    
    @Override
    public void onPause() {
    	CookieSyncManager.getInstance().stopSync();
    	super.onPause();
    }
    /*
    public class MyClass{
    	  private DroidGap mGap;
    	  public MyClass (DroidGap gap)
    	  {
    		  this.mGap = gap;
    	  }
    	  public void startTwitterLogin(String t){ Log.i("DroidGapActivityt", t);
    		  beginTwitterLogin(t);
    	  }
    }
    public void beginTwitterLogin(String s){Log.i("DroidGapActivityss", s);
    	Intent i = new Intent(SalesforceDroidGapCustomActivity.this,twitterLoginActivity.class);
	    i.putExtra("twitterUrl", s);
	    startActivityForResult(i,1111);Log.i("DroidGapActivityss", s);
    }
    protected void onActivityResult(int requestCode, int resultCode, Intent data){Log.i("DroidGap Activity", ""+resultCode);
    	if(requestCode == 1111 && resultCode == 2222){// make sure it is my defined result
    		String result = data.getStringExtra("twitterString");Log.i("DroidGap Activity pass", result);
    		this.appView.loadUrl("javascript:ItbAppUtil.twitterLoginSuc('" + result + "')");
    	}
    }
    */
}
