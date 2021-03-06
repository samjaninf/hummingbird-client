import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import DataErrorMixin from 'client/mixins/routes/data-error';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';
import CoverPageMixin from 'client/mixins/routes/cover-page';

export default Route.extend(DataErrorMixin, CanonicalRedirectMixin, CoverPageMixin, {
  model({ name }) {
    if (name.match(/\D+/)) {
      return get(this, 'store').query('user', {
        filter: { name },
        include: 'profileLinks.profileLinkSite,favorites.item'
      }).then(records => get(records, 'firstObject'));
    }
    return get(this, 'store').findRecord('user', name, {
      include: 'profileLinks.profileLinkSite,favorites.item'
    });
  },

  afterModel(model) {
    set(this, 'headTags', this._headTags(model));
  },

  resetController(controller) {
    this._super(...arguments);
    set(controller, 'isEditing', false);
  },

  serialize(model) {
    return { name: get(model, 'name') };
  },

  _headTags(model) {
    const desc = `${get(model, 'name')} is using Kitsu to share their anime & manga experiences. ${get(model, 'about')}`;
    return [{
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: 'profile'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: desc
      }
    }, {
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        name: 'description',
        content: desc
      }
    }];
  }
});
