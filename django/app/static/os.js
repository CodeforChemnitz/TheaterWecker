var OneSignal = window.OneSignal || [];
OneSignal.push(['init', {
    appId: ONE_SIGNAL_APP_ID,
    autoRegister: false,
    notifyButton: {
        enable: false,
    },
    httpPermissionRequest: {
        enable: true
    },
    welcomeNotification: {
        "title": "TheaterWecker",
        "message": "Herzlich Willkommen beim TheaterWecker",
    },
    promptOptions: {
        siteName: 'TheaterWecker',
        actionMessage: "Möchtest du, dass der TheaterWecker dich benachticht?",
        exampleNotificationTitle: "Es gibt noch Karten für 'BEATE UWE UWE SELFIE KLICK'",
        exampleNotificationMessage: 'Eine europäische Groteske (Uraufführung)',
        acceptButtonText: "Erlauben",
        cancelButtonText: "Nein Danke!"
    }
}]);

function updateEventSubscription() {
    getSubscriptionState().then(function (state) {
        if (state.isPushEnabled && !state.isOptedOut) {
            OneSignal.getUserId().then((userid) => {
                document.querySelector('input[name="email"]').value = '';
                document.querySelector('input[name="device"]').value = userid;
                return Promise.resolve();
            })
                .then(() => {
                    document.querySelector('#subscribe-form').submit();
                });
        }
    });
}

function subscribe(event) {
    getSubscriptionState()
        .then(function (state) {
            if (!state.isPushEnabled) {
                if (state.isOptedOut) {
                    /* Opted out, opt them back in */
                    OneSignal.setSubscription(true);
                } else {
                    /* Unsubscribed, subscribe them */
                    OneSignal.registerForPushNotifications();
                }
            }
            return Promise.resolve();
        })
        .then(updateEventSubscription);
    event.preventDefault();
}

function getSubscriptionState() {
    return Promise.all([
        OneSignal.isPushNotificationsEnabled(),
        OneSignal.isOptedOut(),
    ])
        .then(function ([isPushEnabled, isOptedOut]) {
            return {
                isPushEnabled,
                isOptedOut,
            };
        });
}

OneSignal.push(function () {
    if (!OneSignal.isPushNotificationsSupported()) {
        return;
    }
    OneSignal.on("subscriptionChange", function (isSubscribed) {
        updateEventSubscription();
    });
});
