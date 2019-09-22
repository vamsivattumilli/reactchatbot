import React, { Component } from "react";
import { connect } from "react-redux";
import { sendMessage } from "./chat";
import "./App.css";
import "./font-awesome-animation.min.css";
import * as ReactDOM from "react-dom";
import bot from "./new-bot-black.png";
import yellowBot from "./new-bot-black-yellow.png";
import deloitteLogo from "./DOperate.png";
import marsLogo from "./MARS_logo.png";
import marsM from "./MARS_M.png";
import { library } from "@fortawesome/fontawesome-svg-core";
import nl2br from "react-newline-to-break";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faUserTie,
  faMinus,
  faPlus,
  faRedo,
  faTimes,
  faComments
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import ScrollMenu from "react-horizontal-scrolling-menu";

library.add(faUserTie);
library.add(faRobot);
library.add(faMinus);
library.add(faPlus);
library.add(faRedo);
library.add(faTimes);
library.add(faComments);

const spinnerStyle = {
  hidden: true
};

const list = [
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" },
  { name: "INC1000001" }
];

const MenuItem = ({ text, selected }) => {
  return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
};

export const Menu = list =>
  list.map(el => {
    const { name } = el;

    return <MenuItem text={nl2br(name)} key={name} />;
  });

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};
Arrow.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

export const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
export const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

class App extends Component {
  state = {
    alignCenter: true,
    clickWhenDrag: false,
    dragging: true,
    hideArrows: true,
    hideSingleArrow: true,
    itemsCount: list.length,
    selected: "item1",
    translate: 0,
    transition: 1,
    wheel: true
  };

  constructor(props) {
    super(props);
    this.menu = null;
    this.menuItems = Menu(list.slice(0, list.length), this.state.selected);

    this.state = { showMore: false };
    this.onShowMore = this.onShowMore.bind(this);
  }

  render() {
    const {
      alignCenter,
      clickWhenDrag,
      hideArrows,
      dragging,
      hideSingleArrow,
      itemsCount,
      selected,
      translate,
      transition,
      wheel
    } = this.state;
    const menu = this.menuItems;

    const { feed, sendMessage } = this.props;
    return (
      <div className="fullDiv">
        <img src={deloitteLogo} style={{paddingLeft: 20 +'px',paddingTop: 40 +'px', background: 'black'}}></img>
        {/*<div className="firstParagraph"></div>
        <div className="subPar12Div">
          <span className="subParagraph1"></span>
          <span className="subParagraph2"></span>
        </div>
        <div className="subPar12Div">
          <span className="subParagraph3"></span>
          <span className="subParagraph4"></span>
        </div>
        <div className="subPar12Div">
          <span className="subParagraph5"></span>
          <span className="subParagraph6"></span>
        </div>
        <div className="footerDiv"></div> */}
        <div className="iChat-div">
          <img
            id="iChat"
            className="icon-chat animated faa-tada circle"
            src={bot}
            onClick={this.onChatClick}
          />
        </div>

        <div id="chatDivFade" className="chatDiv animated fadeOutRight">
          <div className="botImage">
            <img src={bot} alt="Logo" />
            <img src={yellowBot} hidden="true" alt="Logo" />
          </div>
          <h4 className="chatHeading">
            <div className="chatHeadingText">
              D Operate
              <FontAwesomeIcon
                id="icon-times"
                size="1x"
                className="icon-times"
                icon="times"
                onClick={this.onItemClick}
              />
            </div>
          </h4>
          <div ref="chatList" className="chatBox">
            <ul className="ulWOBullet">
              {feed.map(entry => (
                <li
                  className={
                    "message " + (entry.sender === "bot" ? "to" : "from")
                  }
                  id="entry.text"
                >
                  <div className="actualData" display="block">
                    <div className="textMessage">
                      {nl2br(entry.text)}
                      {entry.more && <a onClick={this.onShowMore}>more...</a>}
                      {this.state.showMore && (
                        <div>{nl2br(entry.moreInfo)}</div>
                      )}
                    </div>
                    {/* <ScrollMenu
                            ref={el => (this.menu = el)}
                            data={menu}
                            arrowLeft={ArrowLeft}
                            arrowRight={ArrowRight}
                            hideArrows={hideArrows}
                            hideSingleArrow={hideSingleArrow}
                            transition={+transition}
                            onUpdate={this.onUpdate}
                            onSelect={this.onSelect}
                            selected={selected}
                            translate={translate}
                            alignCenter={alignCenter}
                            dragging={dragging}
                            clickWhenDrag={clickWhenDrag}
                            wheel={wheel}
                          /> */}
                    <div className="dateField">{entry.time}</div>

                    {/* For more animations refer https://l-lin.github.io/font-awesome-animation/ */}
                    <div
                      className={
                        entry.sender === "bot" ? "emoji-bot" : "emoji-user"
                      }
                    >
                      <FontAwesomeIcon
                        icon={entry.sender === "bot" ? "robot" : "user-tie"}
                        size="1x"
                        color={entry.sender === "bot" ? "black" : "black"}
                      />
                    </div>
                  </div>
                </li>
              ))}
              <li>
                <div className="spinner message" style={spinnerStyle}>
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>
              </li>
            </ul>
          </div>
          <input
            id="textInput"
            className="textBox"
            type="text"
            placeholder="Please type your message here"
            onKeyDown={e =>
              e.keyCode === 13
                ? sendMessage(e.target.value, "user", this.getCurrentDate())
                : null
            }
          ></input>
        </div>

        {/* <FontAwesomeIcon id="icon-comments" size="3x" className="icon-comments" icon="comments" 
        onClick={this.onChatClick}/> */}
      </div>
    );
  }

  onShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  onItemClick(event) {
    var el = document.getElementById("chatDivFade");
    el.classList.add("fadeOutRight");
    el.classList.remove("fadeInRight");
    var el2 = document.getElementById("iChat");
    el2.classList.add("faa-tada");
  }

  onChatClick(event) {
    var el = document.getElementById("chatDivFade");
    el.classList.add("fadeInRight");
    el.classList.remove("fadeOutRight");
    var el1 = document.getElementById("iChat");
    el1.classList.remove("faa-tada");
  }

  getCurrentDate = () => {
    var currentTime = new Date(); //Current Date
    // var currentOffset = currentTime.getTimezoneOffset();
    // var ISTOffset = 330;
    // var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    var date = currentTime.getDate();
    var month = currentTime.getMonth() + 1; //Current Month
    var year = currentTime.getFullYear(); //Current Year
    var hours = currentTime.getHours(); //Current Hours
    var min = currentTime.getMinutes(); //Current Minutes
    var sec = currentTime.getSeconds(); //Current Seconds
    return (
      date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec
    );
  };

  componentDidMount() {
    document.getElementsByClassName("spinner")[0].hidden = true;
    this.clearForm();
  }

  setItemsCount = ev => {
    const { itemsCount = list.length, selected } = this.state;
    const val = +ev.target.value;
    const itemsCountNew =
      !isNaN(val) && val <= list.length && val >= 0
        ? +ev.target.value
        : list.length;
    const itemsCountChanged = itemsCount !== itemsCountNew;

    if (itemsCountChanged) {
      this.menuItems = Menu(list.slice(0, itemsCountNew), selected);
      this.setState({
        itemsCount: itemsCountNew
      });
    }
  };

  clearForm = () => {
    document.getElementsByClassName("textBox").value = "";
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const { chatList } = this.refs;
    const scrollHeight = chatList.scrollHeight;
    const height = chatList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(chatList).scrollTop =
      maxScrollTop > 0 ? maxScrollTop : 0;
  };
}

const mapStateToProps = state => ({
  feed: state
});

export default connect(
  mapStateToProps,
  { sendMessage }
)(App);
