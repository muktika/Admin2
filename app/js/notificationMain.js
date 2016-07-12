/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

'use strict';

var reg;
var sub;
var isSubscribed = false;

if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('/js/sw.js').then(function(reg) {
        console.log(':^)', reg);
         reg.pushManager.subscribe({userVisibleOnly: true})
  .then(function(pushSubscription) {
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
	console.log('SubscriptionId='+getSubscriptionId(sub.endpoint));
	if (typeof(Storage) !== "undefined") {    
		localStorage.setItem("SubscriptionId", getSubscriptionId(sub.endpoint));    
	}
	addSubscriptionIdToAPI(getSubscriptionId(sub.endpoint));   
    isSubscribed = true;
  });
    }).catch(function(error) {
        console.log(':^(', error);
    });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {    
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);   
  });
}

function addSubscriptionIdToAPI(subscriptionID){	
	$.ajax({
		 type: "POST",
		 url: 'http://www.mockbank.com/chrome-notifications/register',
		 data: {'deviceId':subscriptionID},
		 success: function() {
			 console.log('Success');
		 }
	});
}

function getSubscriptionId(endpointUrl){
	return endpointUrl.substring(endpointUrl.lastIndexOf('/')+1);
}