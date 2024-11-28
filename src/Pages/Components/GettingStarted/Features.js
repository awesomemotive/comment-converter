import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ShadowBox } from '../../../Common/Layout/ShadowBox';

export const Features = (props) => {
	const { ctaButton, ctaExtra, features, subtitle, title, itemClassName = 'mb-2' } = props;

	/**
	 * Render the list item.
	 *
	 * @since 0.9.1
	 *
	 * @param {Object} item  The feature item object, which should have 'icon', 'title', and 'content' properties.
	 * @param {number} index The index of the item in the list.
	 *
	 * @return {JSX.Element} The list item element.
	 */
	const listItem = (item, index) => {
		const listItemClass = classNames('flex flex-row max-w-[calc(50%-30px)]', itemClassName);

		return (
			<li key={index} className={listItemClass}>
				{item.icon}
				<div className="flex flex-col items-start flex-1 text-left">
					{item.title && (
						<h3 className="text-primaryText text-xl leading-[26px] font-bold mb-2">{item.title}</h3>
					)}
					{item.content && (
						<p className="text-base font-normal leading-5 text-primaryText100">{item.content}</p>
					)}
				</div>
			</li>
		);
	};

	return (
		<ShadowBox className="flex flex-col px-[60px] py-[30px] justify-center items-center">
			<h2 className="text-primaryText text-[28px] leading-[36px] text-center font-bold mb-5">{title}</h2>
			<p className="text-primaryText100 font-normal text-lg text-center leading-6 mb-[50px]">{subtitle}</p>

			{features && features.length > 0 && (
				<ul className="flex justify-between flex-wrap gap-x-[30px] gap-y-[24px]">
					{features.map((item, index) => listItem(item, index))}
				</ul>
			)}

			<div className="flex items-center justify-center w-full pt-5">{ctaButton}</div>
			{ctaExtra && <div className="flex items-center justify-center w-full pt-5">{ctaExtra}</div>}
		</ShadowBox>
	);
};

Features.propTypes = {
	ctaButton: PropTypes.node.isRequired,
	ctaExtra: PropTypes.node,
	features: PropTypes.arrayOf(
		PropTypes.shape({
			content: PropTypes.string.isRequired,
			icon: PropTypes.node,
			title: PropTypes.string.isRequired,
		})
	),
	subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	title: PropTypes.node.isRequired,
};
