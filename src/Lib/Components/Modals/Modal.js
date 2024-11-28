import { Fragment, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactModalAdapter from './ReactModalAdapter';
import styled from 'styled-components';
import { IconClose } from '../Icons';

const StyledModal = styled(ReactModalAdapter)`
	font-family: inherit;

	* {
		box-sizing: border-box;
	}

	.Modal__Content--header {
		background-color: #087ce1;
		height: 60px;
		padding: 20px 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 1;
		width: 100%;
	}

	.Modal__Content--header-content {
		color: #fff;
		font-size: 20px;
		font-weight: 700;
		display: flex;
		align-items: center;

		svg {
			margin-right: 8px;
		}
	}

	.Modal__Content--header-close {
		cursor: pointer;
		display: flex;
		color: #abb7ce;
		background-color: transparent;
		border: none;
		padding: 0px;

		svg {
			width: 14px;
			height: 14px;
		}
	}

	.Modal__Content--content {
		height: 100%;
		overflow: auto;
		padding: 20px 40px;
		width: 100%;
	}

	.Modal__Content {
		background-color: #fff;
		border-radius: 4px;
		border: none;
		box-shadow: 0 0 18px 6px rgba(35, 48, 70, 0.25);
		display: flex;
		flex-direction: column;
		max-width: 650px;
		outline: none;
		overflow: auto;
		width: 100%;
		max-width: ${(props) => !!props.width && `${props.width}px`};
		max-height: 80%;
	}

	.Modal__Content p {
		line-height: 1.4;

		a {
			color: #0d82df;
			font-weight: bold;
			text-decoration: underline;
		}
	}

	.Modal__Overlay {
		align-items: center;
		background-color: rgba(68, 77, 94, 0.6); // #444D5E, 60% opacity
		bottom: 0;
		display: flex;
		justify-content: center;
		left: 0;
		position: fixed;
		right: 0;
		top: 0;
		z-index: 1010; // Puts the modal in front of the Tippy sidebar modals.
	}
`;

function Modal(props) {
	const {
		children,
		className,
		isOpen,
		onEnterPress,
		onRequestClose,
		overlayRef = () => {},
		shouldCloseOnOverlayClick = true,
		title,
		titleIcon,
		...rest
	} = props;

	const modalRef = useRef(null);

	/**
	 * Handle the key press event in the whole document.
	 *
	 * @param {Object} ev The key press event object
	 *
	 * @return {void}
	 */
	const handleKeyPress = (ev) => {
		if (!props.isOpen) {
			return;
		}

		if (!modalRef.current) {
			return;
		}

		if (!onEnterPress) {
			return;
		}

		if ('Enter' !== ev.key) {
			return;
		}

		// Test if it's not an element inside the modal, because 'enter' should work as normal if elements are focused.
		if (!modalRef.current.contains(document.activeElement) || modalRef.current === document.activeElement) {
			onEnterPress();
		}
	};

	useEffect(() => {
		document.addEventListener('keypress', handleKeyPress);

		return () => {
			document.removeEventListener('keypress', handleKeyPress);
		};
	});

	const headerContent = props.headerContent || (
		<Fragment>
			{titleIcon} <span className="Modal__Content--header-content-title">{title}</span>
		</Fragment>
	);

	return (
		<StyledModal
			className={className}
			contentClassName={{
				base: 'Modal__Content',
				afterOpen: 'Modal__Content--after-open',
				beforeClose: 'Modal__Content--before-close',
			}}
			contentRef={(node) => (modalRef.current = node)}
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			overlayClassName={{
				base: 'Modal__Overlay',
				afterOpen: 'Modal__Overlay--after-open',
				beforeClose: 'Modal__Overlay--before-close',
			}}
			overlayRef={overlayRef}
			shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
			{...rest}
		>
			<div className="Modal__Content--header">
				{headerContent && <div className="Modal__Content--header-content">{headerContent}</div>}
				<button className="Modal__Content--header-close" onClick={onRequestClose}>
					<IconClose height={14} width={14} />
				</button>
			</div>
			<div className="Modal__Content--content">{children}</div>
		</StyledModal>
	);
}

Modal.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	contentRef: PropTypes.func,
	headerContent: PropTypes.node,
	isOpen: PropTypes.bool.isRequired,
	onEnterPress: PropTypes.func,
	onRequestClose: PropTypes.func.isRequired,
	overlayRef: PropTypes.func,
	shouldCloseOnOverlayClick: PropTypes.bool,
	title: PropTypes.string,
	titleIcon: PropTypes.node,
	width: PropTypes.number,
};

export default Modal;
