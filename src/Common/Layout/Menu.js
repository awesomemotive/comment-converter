import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

export function Menu(props) {
	const { activeItem, items } = props;

	const shouldRenderSubMenu = items.some((item) => {
		const visibleSubMenuItems = item.items?.filter((i) => !i.hideInMenu).length || 0;

		// We should only display the sub menu if there is more than one visible sub menu item.
		if (visibleSubMenuItems <= 1) {
			return false;
		}

		// If the active item is a top-level item with items, we should render the sub-menu
		if (item.slug === activeItem) {
			return true;
		}

		// If the active item is a sub-menu item, we should render the sub-menu
		return item.items?.some((item) => item.slug === activeItem);
	});

	return (
		<nav className="flex-col w-full px-10 bg-white border-b border-neutral40">
			<ul
				className={classnames('flex w-full', {
					'mb-8 border-b border-neutral40': shouldRenderSubMenu,
				})}
			>
				{items.map((item) => {
					const isMenuActive =
						item.slug === activeItem || item.items?.some((item) => item.slug === activeItem);

					return (
						<li
							key={item.slug}
							className="relative flex items-center justify-center h-12 px-4 m-0 first:pl-0 last:pr-0"
						>
							<NavLink
								to={item.path}
								reloadDocument={item.redirect}
								className={classnames(
									'text-neutral90 hover:text-primaryText text-[15px] cursor-pointer shadow-none',
									{ 'text-primaryText': isMenuActive }
								)}
							>
								{item.label}
							</NavLink>

							{/* Sub-Menu */}
							{isMenuActive && item.items?.filter((i) => !i.hideInMenu).length > 1 ? (
								<ul className="absolute left-0 rtl:left-auto rtl:right-0 flex items-center px-4 w-max top-12">
									{item.items.map((subItem) => (
										<li
											key={subItem.slug}
											className="flex items-center justify-center h-8 px-4 m-0 first:pl-0 last:pr-0 rtl:first:!pl-4 rtl:first:!pr-0 rtl:last:!pr-4 rtl:last:!pl-0"
										>
											<NavLink
												to={subItem.path}
												reloadDocument={subItem.redirect}
												className={classnames(
													'text-neutral90 hover:text-primaryText text-[12px] cursor-pointer shadow-none',
													{ 'text-primaryText': subItem.slug === activeItem }
												)}
											>
												{subItem.label}
											</NavLink>
										</li>
									))}
								</ul>
							) : null}
							{/* End Sub-Menu */}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
