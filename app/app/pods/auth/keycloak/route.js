// Copyright 2016 Documize Inc. <legal@documize.com>. All rights reserved.
//
// This software (Documize Community Edition) is licensed under
// GNU AGPL v3 http://www.gnu.org/licenses/agpl-3.0.en.html
//
// You can operate outside the AGPL restrictions by purchasing
// Documize Enterprise Edition and obtaining a commercial license
// by contacting <sales@documize.com>.
//
// https://documize.com

import Ember from 'ember';
import constants from '../../../utils/constants';

export default Ember.Route.extend({
	session: Ember.inject.service(),
	appMeta: Ember.inject.service(),
	kcAuth: Ember.inject.service(),	
	queryParams: {
		mode: {
			refreshModel: false
		}
	},

	beforeModel(transition) {
		this.set('mode', is.not.undefined(transition.queryParams.mode) ? transition.queryParams.mode : 'login');

		let authProvider = this.get('appMeta.authProvider');
		let authConfig = this.get('appMeta.authConfig');

		if (authProvider !== constants.AuthProvider.Keycloak) {
			console.log('Expecting keycloak auth but found ' + authProvider);
			return;
		}

		this.get('kcAuth').boot(JSON.parse(authConfig)).then((kc) => {
			if (!kc.authenticated) {
				this.get('kcAuth').login().then(() => {
				}, (reject) => {
					console.log(reject);
				});
			}

			this.get('kcAuth').fetchProfile(kc).then((profile) => {
				let data = this.get('kcAuth').mapProfile(kc, profile);

				console.log(kc);
				console.log(profile);
				console.log(data);

				// this.get("session").authenticate('authenticator:keycloak', data)
				// 	.then(() => {
				// 		this.transitionTo('folders');
				// 	}, () => {
				// 		this.transitionTo('auth.login');
				// 		console.log(">>>>> Documize SSO failure");
				// 	});

            }, (err) => {
				console.log(err);
            });
		}, (reason) => {
			console.log(reason);
		});
	},
});