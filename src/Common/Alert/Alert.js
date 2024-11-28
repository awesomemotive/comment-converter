import classNames from 'classnames';

export const Alert = (props) => {
	const { children, className, type = 'info', ...rest } = props;

	const classes = classNames(
		'border rounded text-neutral600 text-xs font-normal p-2.5 inline-flex',
		{
			'border-blue300 bg-blue50': type === 'info',
			'border-red300 bg-red50': type === 'error',
		},
		className
	);

	return (
		<div className={classes} {...rest}>
			{children}
		</div>
	);
};
