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
import netUtil from '../../utils/net';

const {
	inject: { service }
} = Ember;

export default Ember.Component.extend({
	folderService: service('folder'),
	folder: null,
	appMeta: service(),
	session: service(),
	view: {
		folder: false,
		search: false,
		settings: false,
		profile: false
	},

	init() {
		this._super(...arguments);

		if (this.get("session.authenticated")) {
			this.get("session.session.content.authenticated.user.accounts").forEach((account) => {
				// TODO: do not mutate account.active here
				account.active = account.orgId === this.get("appMeta.orgId");
			});
		}
	},

	didReceiveAttrs() {
		if (this.get('folder') === null) {
			this.set("folder", this.get('folderService.currentFolder'));
		}

		let route = this.get('router.currentRouteName');
		this.set('view.folder', (is.startWith(route, 'folder')) ? true : false);
		this.set('view.settings', (is.startWith(route, 'customize')) ? true : false);
		this.set('view.profile', (route === 'profile') ? true : false);
		this.set('view.search', (route === 'search') ? true : false);
	},

	actions: {
		switchAccount(domain) {
			this.audit.record('switched-account');
			window.location.href = netUtil.getAppUrl(domain);
		}
	}
});
