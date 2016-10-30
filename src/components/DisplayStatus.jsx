import React from 'react';

class DisplayStatus extends React.Component {
  constructor(props) {
    super(props);

    this.setParentStatus = this.setParentStatus.bind(this)
  }

  setParentStatus() {
    this.props.onClick(this.props.index);
  }

  render() {
    return(
      <div onClick={this.setParentStatus} className="status">
        {this.props.data}
      </div>
    );
  }
}

DisplayStatus.propTypes = {
  onClick: React.PropTypes.func,
  data: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired
}

export default DisplayStatus;
