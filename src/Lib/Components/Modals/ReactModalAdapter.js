import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

/**
 * This is a wrapper for changing the ReactModal component into something that
 * can be styled as a styled-component.
 *
 * @see {@link https://github.com/reactjs/react-modal/issues/603}
 * @see {@link https://github.com/reactjs/react-modal/issues/627}
 *
 * @param          props.contentClassName
 * @param          props.className
 * @param {Object} props                  The modal props.
 *
 * @return {ReactModal} The adapted class.
 */
function ReactModalAdapter({ className, contentClassName, ...props }) {
	// You must add the line below to your app, with the appropriate app selector.
	// ReactModal.setAppElement('#root');
	return <ReactModal className={contentClassName} portalClassName={className} {...props} />;
}

ReactModalAdapter.propTypes = {
	className: PropTypes.string,
	contentClassName: PropTypes.object,
};

export default ReactModalAdapter;
