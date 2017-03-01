import React from 'react';
import ReactDOM from 'react-dom';

export default class InlineEdit extends React.Component {

	static propTypes = {
		component: React.PropTypes.element.isRequired,
		value: React.PropTypes.any,
		layout: React.PropTypes.string.isRequired,
		display: React.PropTypes.string.isRequired,
		cancelText: React.PropTypes.string.isRequired,
		saveText: React.PropTypes.string.isRequired,
		minWidth: React.PropTypes.number.isRequired,
		autoSave: React.PropTypes.bool.isRequired,
		allClickable: React.PropTypes.bool.isRequired,
		onSave: React.PropTypes.func,
		onCancel: React.PropTypes.func
	};

	static defaultProps = {
		autoSave: false,
		display: 'inline-block',
		layout: 'popup',
		cancelText: 'Storno',
		saveText: 'OK',
		minWidth: 92,
		allClickable: false
	};

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			value: props.value
		};
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.mounted = true;
	}

	componentDidMount() {
		document.addEventListener('click', this.handleDocumentClick, false);
	}

	componentWillUnmount() {
		this.mounted = false;
		document.removeEventListener('click', this.handleDocumentClick, false);
	}

	handleDocumentClick(event) {
		if(this.mounted && this.props.layout != 'inline') {
			if (!ReactDOM.findDOMNode(this).contains(event.target)) {
				this.setState({isOpen:false});
				if (this.props.onCancel) {
					this.props.onCancel();
				}
			}
		}
	}

	handleEdit(e) {
		this.setState({value: this.props.value, isOpen: true});
	}

	handleChange(value) {
		this.setState({value});
	}

	handleBlur(value) {
		if (this.props.autoSave && this.props.onSave) {
			if (this.state.value != value) {
				this.props.onSave(value);
			}
			this.setState({isOpen: false});
		}
	}

	handleClickSave(e) {
		e.preventDefault();
		this.setState({isOpen: false});
		if (this.props.onSave) {
			this.props.onSave(this.state.value);
		}
	}

	handleEditSave(value) {
		this.setState({value, isOpen: false});
		if (this.props.onSave) {
			this.props.onSave(value);
		}
	}

	handleClickCancel(e) {
		e.preventDefault();
		this.setState({isOpen: false});
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	getEditElement() {
		return React.cloneElement(this.props.component, {
			value: this.state.value,
			autoFocus: true,
			onChange: (value) => this.handleChange(value),
			onBlur: (value) => this.handleBlur(value),
			onSave: (value) => this.handleEditSave(value)
		});
	}

	renderInlineEdit() {
		if (!this.state.isOpen || this.props.layout != 'inline') {
			return (
				<span className="inline-text">
					<span onClick={(e) => this.handleEdit(e)}
						  className="editicon icon-pencil3">
					</span>
					{this.props.allClickable &&
						<span onClick={(e) => this.handleEdit(e)} style={{cursor:'pointer', display: this.props.display}}>
							{this.props.children}
						</span>}
					{!this.props.allClickable &&
						<span style={{display: this.props.display}}>
							{this.props.children}
						</span>}
				</span>
			);
		}
		else {
			return (
				<div className="inlinedit-inline">
					{this.getEditElement()}
				</div>
			);

		}
	}

	renderPopupEdit() {
		if (!this.state.isOpen || this.props.layout == 'inline') {
			return false;
		}

		return (
			<div className="inlinedit" style={{minWidth: this.props.minWidth}}>
				<div className="inlinedit-inner">
					<div>{this.getEditElement()}</div>
					{!this.props.autoSave &&
					<div className="buttons">
						<button onClick={(e) => this.handleClickCancel(e)} className="btn btn-default">
							{this.props.cancelText}
						</button>
						<button onClick={(e) => this.handleClickSave(e)} className="btn btn-primary">
							{this.props.saveText}
						</button>
					</div>}
				</div>
			</div>
		)
	}

	render() {
		return  (
				<div className="inlineedit-wrapper">
					{this.renderInlineEdit()}
					{this.renderPopupEdit()}
				</div>
		)
	}
}
