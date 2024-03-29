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
package com.salesforce.androidsdk.security;

import com.salesforce.androidsdk.ui.PasscodeActivity;
import com.salesforce.androidsdk.util.EventsObservable;
import com.salesforce.androidsdk.util.EventsObservable.EventType;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Handler;
import android.util.Log;


/**
 * This class manages the inactivity timeout, and keeps track of if the UI should locked etc.
 */
/**
 * @author wmathurin
 *
 */
public class PasscodeManager  {

	// Key in preference for the passcode
	private static final String KEY_PASSCODE ="passcode";
	
	// Private preference where we stored the passcode (hashed)
	private static final String PREF_NAME = "user";

	// this is a hash of the passcode to be used as part of the key to encrypt/decrypt oauth tokens 
	// It's using a different salt/key than the one used to verify the entry
	private String passcodeHash;
	
	// Misc
	private HashConfig verificationHashConfig;
	private HashConfig encryptionHashConfig;
	private int failedPasscodeAttempts;
	private Activity frontActivity;
	private Handler handler;
	private long lastActivity;
	private boolean locked;
	private int timeoutMs;

	/**
	 * @param ctx
	 * @param lockTimeoutMinutes
	 * @param verificationHashConfig
	 * @param encryptionHashConfig
	 */
	public PasscodeManager(Context ctx, int lockTimeoutMinutes,
			HashConfig verificationHashConfig, HashConfig encryptionHashConfig) {
		this.timeoutMs = lockTimeoutMinutes * 60 * 1000;
		this.lastActivity = now();
		this.verificationHashConfig = verificationHashConfig;
		this.encryptionHashConfig = encryptionHashConfig;

		// Locked at app startup if you're authenticated
		this.locked = true;
		handler = new Handler();
		handler.postDelayed(new LockChecker(), 20 * 1000);
	}
	
	/**
	 * Reset this passcode manager: delete stored passcode and reset fields to their starting value
	 */
	public void reset(Context ctx) {
		lastActivity = now();
		locked = true;
		failedPasscodeAttempts = 0;
		passcodeHash = null;
		SharedPreferences sp = ctx.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
		Editor e = sp.edit();
		e.remove(KEY_PASSCODE);
		e.commit();
	}
	
	/** 
	 * @return the new failure count 
	 */
	public int addFailedPasscodeAttempt() {
		return ++failedPasscodeAttempts;
	}
	
	/**
	 * @param ctx
	 * @param passcode
	 * @return true if passcode matches the one stored (hashed) in private preference
	 */
	public boolean check(Context ctx, String passcode) {
		SharedPreferences sp = ctx.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
		String hashedPasscode = sp.getString(KEY_PASSCODE, null);
		return hashedPasscode.equals(hash(passcode, verificationHashConfig));
	}
	
	/**
	 * Store the given passcode (hashed) in private preference
	 * @param ctx
	 * @param passcode
	 */
	public void store(Context ctx, String passcode) {
		SharedPreferences sp = ctx.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
		Editor e = sp.edit();
		e.putString(KEY_PASSCODE, hash(passcode, verificationHashConfig));
		e.commit();
	}
	
	/**
	 * @param ctx
	 * @return true if passcode was already created
	 */
	public boolean hasStoredPasscode(Context ctx) {
		SharedPreferences sp = ctx.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
		return sp.contains(KEY_PASSCODE);
	}
	
	/**
	 * @return number of failed passcode attempts
	 */
	public int getFailedPasscodeAttempts() {
		return failedPasscodeAttempts;
	}
	
	/** 
	 * @return a hash of the passcode that can be used for encrypting oauth tokens
	 */
	public String getPasscodeHash() {
		return passcodeHash;
	}
	
	/**
	 * @return true if locked
	 */
	public boolean isLocked() {
		return timeoutMs > 0 && locked;
	}

	/**
	 * @param ctx
	 */
	public void lock(Context ctx) {
		locked = true;
		showLockActivity(ctx);
		EventsObservable.get().notifyEvent(EventType.AppLocked);		
	}
	
	/**
	 * @param newFrontActivity
	 * @param registerActivity
	 * @return
	 */
	public boolean lockIfNeeded(Activity newFrontActivity, boolean registerActivity) {
		if (newFrontActivity != null)
			frontActivity = newFrontActivity;
		if (isLocked() || shouldLock()) {
			lock(frontActivity);
			return true;
		} else {
			if (registerActivity) updateLast();
			return false;
		}
	}

	/**
	 * @param a
	 */
	public void nolongerFrontActivity(Activity a) {
		if (frontActivity == a)
			frontActivity = null;
	}
	
	public void recordUserInteraction() {
		updateLast();
	}

	public void setTimeoutMs(int newTimeout) {
		timeoutMs = newTimeout;
	}
	
	public int getTimeoutMs() {
		return timeoutMs;
	}
	
	public boolean shouldLock() {
		return timeoutMs > 0 && now() >= (lastActivity + timeoutMs);
	}
	
	public void showLockActivity(Context ctx) {
		if (ctx == null) return;
		Intent i = new Intent(ctx, PasscodeActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
		i.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
		ctx.startActivity(i);
	}

	public void unlock(String passcode) {
		locked = false;
		failedPasscodeAttempts = 0;
		passcodeHash = hash(passcode, encryptionHashConfig);
		updateLast();
		EventsObservable.get().notifyEvent(EventType.AppUnlocked);
	}

	protected long now() {
		return System.currentTimeMillis();
	}
	
	private void updateLast() {
		lastActivity = now();
	}

	private String hash(String passcode, HashConfig hashConfig) {
		return Encryptor.hash(hashConfig.prefix + passcode + hashConfig.suffix, hashConfig.key);
	}
	
	/** 
	 * Thread checking periodically to see how much has elapsed since the last recorded activity
 	 * When that elapsed time exceed timeoutMs, it locks the app
 	 */
	private class LockChecker implements Runnable {
		public void run() {
			try {
				Log.i("LockChecker:run",  "isLocked:" + locked + " elapsedSinceLastActivity:" + ((now() - lastActivity)/1000) + " timeout:" + (timeoutMs / 1000));
				if (!locked)
					lockIfNeeded(null, false);
			} finally {
				handler.postDelayed(this, 20 * 1000);
			}
		}
	}
	
	/**
	 * Key for hashing and salts to be preprended and appended to data to increase entropy.
	 */
	public static class HashConfig {
		public final String prefix;
		public final String suffix;
		public final String key;
		public HashConfig(String prefix, String suffix, String key) {
			this.prefix = prefix;
			this.suffix = suffix;
			this.key = key;
		}
	}

}
