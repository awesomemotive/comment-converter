import classNames from 'classnames';

export const PageBody = ({ children, className }) => {
	const classes = classNames('py-[26px] px-[40px]', className);
	return <div className={classes}>{children}</div>;
};
