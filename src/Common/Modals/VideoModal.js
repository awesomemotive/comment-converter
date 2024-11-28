import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from '../../Lib/Components/Modals/Modal';
import { IconClose } from '../Icons';
import { appId } from '../../data';

const StyledModal = styled(Modal)`
	.Modal__Overlay {
		background: rgba(0, 0, 0, 0.9);
	}

	.Modal__Content--header {
		display: none;
	}

	.Modal__Content--content {
		padding: 0;
	}

	.Modal__Content {
		max-height: 495px;
		max-width: 888px;
		min-width: 888px;
		width: 888px;
	}
`;

export function VideoModal(props) {
	const { src, title, ...rest } = props;

	return (
		<StyledModal {...rest} closeIcon={IconClose} parentSelector={() => document.querySelector(`#${appId}`)}>
			<iframe
				title={title}
				width="888"
				height="495"
				src={src}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		</StyledModal>
	);
}

VideoModal.propTypes = {
	...Modal.propTypes,
	src: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};
