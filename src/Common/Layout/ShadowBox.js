import classNames from 'classnames';

export function ShadowBox(props) {
	const { children, className, ...rest } = props;

	const wrapperClasses = classNames('flex flex-col items-start w-full rounded-lg bg-white shadow-ccvtr', className);

	return (
		<div {...rest} className={wrapperClasses}>
			{children}
		</div>
	);
}
