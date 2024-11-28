import { withWPStyles } from '../../../../.storybook/decorators/withWPStyles';
import { RowActions } from '../ListTable/RowActions';
import { UserCell } from '../ListTable/UserCell';
import { WpListTable } from '../ListTable/WpListTable';
import { withCCStyles } from '../../../../.storybook/decorators/withCCStyles';

const bulkActionOptions = [
	{
		value: 'option-1',
		label: 'Option 1',
	},
	{
		value: 'option-2',
		label: 'Option 2',
	},
];

const filterOptions = [
	{
		value: '',
		label: 'All',
	},
	{
		value: 'option-1',
		label: 'Option 1',
	},
	{
		value: 'option-2',
		label: 'Option 2',
	},
];

export default {
	title: 'Common/WordPress/WP List Table',
	component: WpListTable,
	decorators: [
		withCCStyles,
		//withWPStyle
	],
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
	args: {
		columns: [
			{
				slug: 'follower',
				label: 'Follower',
				classes: 'column-author',
				sortable: true,
			},
			'Followed From',
			'Comment',
			'Followed On',
			'Subscriber',
		],
		rows: [1, 2, 3, 4, 5].map((id) => {
			return {
				id,
				classes: 3 === id ? 'unapproved' : '',
				data: [
					<UserCell
						actions={[
							{
								slug: 'quick-edit',
								label: 'Quick Edit',
							},
							{
								slug: 'edit',
								label: 'Edit',
							},
							{
								slug: 'delete',
								label: 'Delete',
							},
						]}
						name="Archie"
						email="archie@optinmonster.com"
						avatarSrc="http://0.gravatar.com/avatar/c2b06ae950033b392998ada50767b50e?s=64&d=mm&r=g"
					/>,
					<a href="#">Link to post</a>,
					<>
						<p>Comment</p>
					</>,
					'2023/09/13 at 8:26 pm',
					<span>Yes or NO</span>,
				],
			};
		}),
		bulkActionControl: {
			options: bulkActionOptions,
			onApply: (value) => {
				console.log('Action apply:', value); // eslint-disable-line no-console
			},
		},
		filterControl: {
			options: filterOptions,
			value: '',
			onApply: (value) => {
				console.log('Filter apply:', value); // eslint-disable-line no-console
			},
		},
		paginationControl: {
			current: 1,
			total: 10,
			onApply: (value) => {
				console.log('Pagination apply:', value); // eslint-disable-line no-console
			},
		},
		searchControl: {
			value: '',
			onApply: (value) => {
				console.log('Search apply:', value); // eslint-disable-line no-console
			},
		},
		sortControl: {
			sortedBy: null,
			sortedOrder: null,
			onApply: (value) => {
				console.log('Sorting apply:', value); // eslint-disable-line no-console
			},
		},
		totalItems: 10,
		tbodyProps: {
			id: 'the-comment-list',
		},
	},
};

const Template = (args) => {
	return <WpListTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {};

export const WithoutSearching = Template.bind({});
WithoutSearching.args = {
	searchControl: {
		hide: true,
	},
};

export const WithoutFiltering = Template.bind({});
WithoutFiltering.args = {
	filterControl: {
		hide: true,
	},
};
