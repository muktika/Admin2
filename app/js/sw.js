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

// Version 0.1

'use strict';

console.log('Started', self);

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);  	
	var title = 'mockbank.com';
	event.waitUntil(fetch('http://www.mockbank.com/notification-data?param='+Math.random()).then(function(response) {		
			if (response.status !== 200) {          
				console.log('Looks like there was a problem. Status Code: ' + response);  
				return;  
			}		
			response.json().then(function(jsonData) {  
				return self.registration.showNotification(title, {  
				  body: jsonData.data.message,  
				  icon: jsonData.data.img_url,	 
				   data: {
					url: jsonData.data.action_url
				  }  		
				}); 
			});
		
		})
	);
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification);  
  event.notification.close();
  var url = event.notification.data.url;
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});