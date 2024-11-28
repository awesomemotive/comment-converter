import classNames from 'classnames';

export const List = (props) => {
	return <ul {...props} />;
};

export const ListItem = (props) => {
	const { className, ...rest } = props;

	const classes = classNames(
		'flex flex-col items-start w-full mb-4 last:mb-0 border-b border-lightGray pb-4',
		className
	);

	return <li className={classes} {...rest} />;
};
