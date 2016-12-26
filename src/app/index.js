import $ from 'jquery';
import {createRouter} from 'vanilla-ui-router';
import ko from 'knockout';

// this is necessary because bootstrap itself checks the existence of jQuery with window.jQuery.
window.jQuery = $;
require('bootstrap');

const router = createRouter(document.getElementById('app'));

const viewModel = {
	name: ko.observable('Max Mustermann')
}

router
	.addRoute('', () => {
		router.navigateTo('about');
	})
	.addRoute('about', {
		templateUrl: 'about/about.html',
		routeHandler: () => {
			console.warn('about route is called....');
		}
	})

	.addRoute('statistic', {
		templateUrl: 'statistic.html',
		routeHandler: $el => {
			ko.applyBindings(viewModel, $el);
		}
	});
