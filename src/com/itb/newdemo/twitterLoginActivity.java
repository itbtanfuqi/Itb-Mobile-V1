package com.itb.newdemo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class twitterLoginActivity extends Activity {
	private WebView wv;
	private Intent i;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		i = getIntent();
		String url = i.getExtras().getString("twitterUrl");Log.i("twitterLoginActivity ~~~", url);
		setContentView(R.layout.twitterlogin);
		wv = (WebView) findViewById(R.id.twitter_webview);
		wv.getSettings().setJavaScriptEnabled(true);
		wv.setWebViewClient(new twitterWebViewClient());
		wv.setWebChromeClient(new twitterWebChromeClient());
		wv.loadUrl(url);
	}
	class twitterWebViewClient extends WebViewClient {
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {//Log.i("twitter ShouldOverride", url);
			//Log.i("twitterActivity url", url);
			boolean isDone;
			if(url.indexOf("TWITTERCALLBACK") >= 0){
				isDone = true;							
			}else{
				isDone = false;
			}
			if (isDone) {
				//wv.loadUrl("javascript:ItbAppUtil.twitterLoginSuc(url)");
				Intent data = new Intent();
				data.putExtra("twitterString", url); //Log.i("twitter ShouldOverride pass", url);
				twitterLoginActivity.this.setResult(2222, data);
				twitterLoginActivity.this.finish();
			}
			return isDone;
		}
	}
	class twitterWebChromeClient extends WebChromeClient {

		@Override
		public void onProgressChanged(WebView view, int newProgress) {
			setProgress(newProgress * 100);
		}
	}
}