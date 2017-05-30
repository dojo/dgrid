import { w } from '@dojo/widget-core/d';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import Grid from '../src/Grid';
import ArrayDataProvider from '../src/providers/ArrayDataProvider';

const data = [
	{ order: 1, name: 'preheat', description: 'Preheat your oven to 350F' },
	{ order: 2, name: 'mix dry', description: 'In a medium bowl, combine flour, salt, and baking soda' },
	{ order: 3, name: 'mix butter', description: 'In a large bowl, beat butter, then add the brown sugar and white sugar then mix' },
	{ order: 4, name: 'mix together', description: 'Slowly add the dry ingredients from the medium bowl to the wet ingredients in the large bowl, mixing until the dry ingredients are totally combined' },
	{ order: 5, name: 'chocolate chips', description: 'Add chocolate chips' },
	{ order: 6, name: 'make balls', description: 'Scoop up a golf ball size amount of dough with a spoon and drop in onto a cookie sheet' },
	{ order: 7, name: 'bake', description: 'Put the cookies in the oven and bake for about 10-14 minutes' },
	{ order: 8, name: 'remove', description: 'Using a spatula, lift cookies off onto wax paper or a cooling rack' },
	{ order: 9, name: 'eat', description: 'Eat and enjoy!' }
];

const instructions: any[] = [];
for (let i = 1; i <= 1000; i++) {
	const instruction = Object.create(data[Math.floor(Math.random() * data.length)]);
	instruction.order = i;
	instructions.push(instruction);
}

const dataProvider = new ArrayDataProvider({
	idProperty: 'order',
	data: instructions
});

const columns = [
	{
		id: 'order',
		label: 'step' // give column a custom name
	},
	{
		id: 'name'
	},
	{
		id: 'description',
		label: 'what to do',
		sortable: false
	}
];

const ProjectorBase = ProjectorMixin(WidgetBase);

class Projector extends ProjectorBase<WidgetProperties> {
	render() {
		return w(Grid, {
			dataProvider,
			columns
		});
	}
}

const projector = new Projector();

projector.append();
