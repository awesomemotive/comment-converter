import classNames from 'classnames';
import { ShadowBox } from './ShadowBox';

export function WhiteBox(props) {
	const { children, className, header, ...rest } = props;

	const bodyClasses = classNames('py-6 px-[30px] w-full');

	const headerClasses = classNames('py-4 px-[30px] w-full', 'flex items-center border-b border-neutral40');

	const wrapperClasses = classNames(className, {
		// When not displaying a header, the body classes should fallback to the wrapper.
		[bodyClasses]: !header,
	});

	return (
		<ShadowBox {...rest} className={wrapperClasses}>
			{header ? (
				<>
					<div className={headerClasses}>{header}</div>
					<div className={bodyClasses}>{children}</div>
				</>
			) : (
				children
			)}
		</ShadowBox>
	);
}
