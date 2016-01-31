import React from 'react';
import ReactDOM from 'react-dom';

export default class InlineEdit extends React.Component {

	static propTypes = {
		component: React.PropTypes.element.isRequired,
		cancelText: React.PropTypes.string.isRequired,
		saveText: React.PropTypes.string.isRequired,
		minWidth: React.PropTypes.number.isRequired,
		onSave: React.PropTypes.func,
		onCancel: React.PropTypes.func
	};

	static defaultProps = {
		cancelText: 'Storno',
		saveText: 'OK',
		minWidth: 92
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
		if(this.mounted) {
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

	renderInlineEditBox() {
		if (!this.state.isOpen) {
			return false;
		}

		const editComponent = React.cloneElement(this.props.component, {
			value: this.state.value,
			autoFocus: true,
			onChange: (value) => this.handleChange(value),
			onSave: (value) => this.handleEditSave(value)
		});

		return (
			<div className="inlinedit" style={{minWidth: this.props.minWidth}}>
				<div className="inlinedit-inner">
					<div>{editComponent}</div>
					<div className="buttons">
						<button onClick={(e) => this.handleClickCancel(e)} className="btn btn-grey">
							{this.props.cancelText}
						</button>
						<button onClick={(e) => this.handleClickSave(e)} className="btn btn-primary">
							{this.props.saveText}
						</button>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return  (
				<div className="inlineedit-wrapper">
					<span onClick={(e) => this.handleEdit(e)} className="editicon fa fa-pencil"></span>
					<span onClick={(e) => this.handleEdit(e)} style={{cursor:'pointer'}}>
						{this.props.children}
					</span>
					{this.renderInlineEditBox()}
				</div>
		)
	}
}
