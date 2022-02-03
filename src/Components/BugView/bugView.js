import React, { useState } from 'react';
import ViewSection from './component/bugViewSection';
import BugModel from '../Models/bugModel';
import './bugView.css';
import EditPanel from '../editDeletePanel/editPanel';
import { useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const BugView = (props) => {
  const bug = new BugModel(props.bug);
  let history = useHistory();
  let oldValues = [];
  let newValues = [];
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState();
  const [commentList, setCommentList] = useState([]);
  const [commentsPage, setCommentsPage] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyPage, setHistoryPage] = useState(false);
  const [editedField, setEditedField] = useState({
    details: bug.details,
    assigned: bug.assigned,
    priority: bug.priority,
    creator: bug.creator,
    status: bug.status,
    project: bug.project,
    type: bug.type,
  });

  function getPriorityValue(value) {
    if (value == 'High') {
      return 1;
    } else if (value == 'Medium') {
      return 2;
    } else if (value == 'Low') {
      return 3;
    } else if (value == 1) {
      return 1;
    } else if (value == 2) {
      return 2;
    } else if (value == 3) {
      return 3;
    }
  }

  const redirect = () => {
    history.go(0);
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  function deleteClicked() {
    fetch('https://murmuring-mountain-40437.herokuapp.com/bugs', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bug.name,
        id: bug.id,
      }),
    }).then((response) =>
      response.json().then((res) => {
        redirect();
      })
    );
  }

  function editClicked() {
    setEdit(!edit);
  }

  function submitClicked() {
    if (
      bug.details == editedField.details &&
      bug.assigned == editedField.assigned &&
      bug.priority == editedField.priority &&
      bug.creator == editedField.creator &&
      bug.status == editedField.status &&
      bug.type == editedField.type &&
      bug.project == editedField.project
    ) {
      redirect();
    } else {
      if (bug.details !== editedField.details) {
        oldValues.push(`Description: ${bug.details}`);
        newValues.push(`Description: ${editedField.details}`);
      }

      if (bug.assigned !== editedField.assigned) {
        oldValues.push(`Assigned Developer: ${bug.assigned}`);
        newValues.push(`Assigned Developer: ${editedField.assigned}`);
      }

      if (bug.priority !== editedField.priority) {
        oldValues.push(`Ticket Priority: ${bug.priority}`);
        newValues.push(`Ticket Priority: ${editedField.priority}`);
      }

      if (bug.status !== editedField.status) {
        oldValues.push(`Ticket Status: ${bug.status}`);
        newValues.push(`Ticket Status: ${editedField.status}`);
      }
      if (bug.type !== editedField.type) {
        oldValues.push(`Ticket Type: ${bug.type}`);
        newValues.push(`Ticket Type: ${editedField.type}`);
      }
      if (bug.status !== editedField.project) {
        oldValues.push(`Ticket Project: ${bug.project}`);
        newValues.push(`Ticket Project: ${editedField.project}`);
      }

      if (bug.details == editedField.details) {
        setEditedField({ details: bug.details });
      }

      if (bug.assigned == editedField.assigned) {
        setEditedField({ assigned: bug.assigned });
      }

      if (bug.priority == editedField.priority) {
        setEditedField({ priority: bug.priority });
      }

      if (bug.creator == editedField.creator) {
        setEditedField({ creator: bug.creator });
      }

      if (bug.status == editedField.status) {
        setEditedField({ status: bug.status });
      }
      if (bug.type == editedField.type) {
        setEditedField({ type: bug.type });
      }
      if (bug.project == editedField.project) {
        setEditedField({ project: bug.project });
      }

      fetch('https://murmuring-mountain-40437.herokuapp.com/editBugTimeStamp', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editor: props.user.name,
          bugId: bug.id,
          oldValues: oldValues,
          newValues: newValues,
        }),
      }).then((response) => response.json().then((res) => {}));
      fetch('https://murmuring-mountain-40437.herokuapp.com/bugs', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          details: editedField.details,
          assigned: editedField.assigned,
          priority: getPriorityValue(editedField.priority),
          creator: editedField.creator,
          status: editedField.status,
          type: editedField.type,
          project: editedField.project,
          id: bug.id,
        }),
      }).then((response) =>
        response.json().then((res) => {
          redirect();
        })
      );
    }
  }

  function backClicked() {
    setCommentsPage(!commentsPage);
  }
  function backClickedTwo() {
    setHistoryPage(!historyPage);
  }

  function commentsClicked() {
    setCommentsPage(!commentsPage);
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/comments/${bug.id}`
    ).then((response) =>
      response.json().then((comments) => {
        let formattedCommentList = comments.map((comment) =>
          Object.assign({}, comment, {
            created: getFormattedDate(comment.created),
          })
        );
        setCommentList(formattedCommentList);
      })
    );
  }

  function historyClicked() {
    setHistoryPage(!historyPage);
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/getHistory${bug.id}`
    ).then((response) =>
      response.json().then((historyListItems) => {
        let formattedHistoryList = historyListItems.map((historyItem) =>
          Object.assign({}, historyItem, {
            time: getFormattedDate(historyItem.time),
          })
        );
        setHistoryList(formattedHistoryList);
      })
    );
  }

  function addCommentClicked() {
    fetch('https://murmuring-mountain-40437.herokuapp.com/comments', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commenter: props.user.name,
        bugId: bug.id,
        message: comment,
      }),
    }).then((response) =>
      response.json().then((res) => {
        fetch(
          `https://murmuring-mountain-40437.herokuapp.com/comments/${bug.id}`
        ).then((response) =>
          response.json().then((comments) => {
            let formattedCommentList = comments.map((comment) =>
              Object.assign({}, comment, {
                created: getFormattedDate(comment.created),
              })
            );
            setCommentList(formattedCommentList);
          })
        );
      })
    );
  }

  function formatValue(value) {
    const newArray = String(value).split(',');
    return newArray;
  }

  var columns = [
    {
      dataField: 'commenter',
      text: 'Commenter',
      sort: true,
      formatter: (cell) => <p>{cell} </p>,
      editCellClasses: 'cells',
    },
    {
      dataField: 'message',
      text: 'Message',
      sort: true,
      formatter: (cell) => <p> {cell} </p>,
    },
    {
      dataField: 'created',
      text: 'Created',
      sort: true,
    },
  ];

  var columnsTwo = [
    {
      dataField: 'editor',
      text: 'Editor',
      sort: true,
      formatter: (cell) => <p>{cell} </p>,
      editCellClasses: 'cells',
    },
    {
      dataField: 'oldvalue',
      text: 'Old Value',
      sort: true,
      formatter: (cell) =>
        formatValue(cell).map((item) => {
          return <p>{item}</p>;
        }),
    },
    {
      dataField: 'newvalue',
      text: 'New Value',
      sort: true,
      formatter: (cell) =>
        formatValue(cell).map((item) => {
          return <p>{item}</p>;
        }),
    },
    {
      dataField: 'time',
      text: 'Time of Edit',
      sort: true,
    },
  ];

  const { SearchBar } = Search;
  const data = commentList;
  const dataTwo = historyList;

  const pagination = paginationFactory({
    sizePerPage: 10,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    hideSizePerPage: true,
  });

  const rowClasses = (row, rowIndex) => {
    return 'row';
  };

  const getFormattedDate = (dateValue) => {
    var date = new Date(dateValue);
    var formatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    var dateString = date.toLocaleDateString('en-US', formatOptions);
    dateString = dateString
      .replace(',', '')
      .replace('PM', 'p.m.')
      .replace('AM', 'a.m.');
    return dateString;
  };

  return (
    <>
      {(() => {
        if (!commentsPage && !historyPage) {
          return (
            <div className="bug-view overlay">
              <EditPanel
                deleteClicked={deleteClicked}
                editClicked={editClicked}
                edit={edit}
                submitClicked={submitClicked}
                commentsClicked={commentsClicked}
                historyClicked={historyClicked}
                user={props.user.role}
                close={props.clicked}
              />
              <h1>{bug.name}</h1>
              <ViewSection
                title="Description"
                info={bug.details}
                edit={edit}
                editedField={handleChange}
                name="details"
                user={props.user.role}
              />
              <ViewSection
                title="Assigned Developer"
                info={bug.assigned}
                edit={edit}
                editedField={handleChange}
                name="assigned"
                user={props.user.role}
                users={props.users}
              />
              <ViewSection
                title="Submitter"
                info={bug.creator}
                edit={edit}
                editedField={handleChange}
                name="creator"
                user={props.user.role}
              />
              <ViewSection
                title="Project"
                info={bug.project}
                edit={edit}
                editedField={handleChange}
                name="project"
                user={props.user.role}
                projects={props.projects}
              />
              <ViewSection
                title="Priority"
                info={bug.priority}
                edit={edit}
                editedField={handleChange}
                name="priority"
                user={props.user.role}
              />
              <ViewSection
                title="Ticket Status"
                info={bug.status}
                edit={edit}
                editedField={handleChange}
                name="status"
                user={props.user.role}
              />
              <ViewSection
                title="Ticket Type"
                info={bug.type}
                edit={edit}
                editedField={handleChange}
                name="type"
                user={props.user.role}
              />
            </div>
          );
        } else if (commentsPage && !historyPage) {
          return (
            <div className="bug-view overlay">
              <div className="comments-container">
                <div className="button-container">
                  <button onClick={backClicked} className="">
                    Back
                  </button>
                  <button onClick={props.clicked} className="">
                    Close
                  </button>
                </div>
                <h2 className="comment-title">Add a Comment?</h2>
                <input
                  className="add-comment"
                  onChange={handleCommentChange}
                ></input>
                <button className="add-button" onClick={addCommentClicked}>
                  ADD
                </button>
                <h2 className="ticket-title">Ticket Comments</h2>
                <div className="comments-table">
                  <ToolkitProvider
                    keyField="id"
                    data={data}
                    columns={columns}
                    search
                  >
                    {(props) => (
                      <div>
                        <div className="comment-search-bar-container">
                          <SearchBar
                            className="comment-search-bar"
                            {...props.searchProps}
                          />
                        </div>
                        <BootstrapTable
                          keyField="id"
                          data={data}
                          columns={columns}
                          {...props.baseProps}
                          filter={filterFactory()}
                          pagination={pagination}
                          rowClasses={rowClasses}
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="bug-view overlay">
              <div className="comments-container">
                <div className="button-container">
                  <button onClick={backClickedTwo} className="">
                    Back
                  </button>
                  <button onClick={props.clicked} className="">
                    Close
                  </button>
                </div>
                <h2 className="ticket-title">Ticket History</h2>
                <div className="comments-table">
                  <ToolkitProvider
                    keyField="id"
                    data={dataTwo}
                    columns={columnsTwo}
                    search
                  >
                    {(props) => (
                      <div>
                        <SearchBar {...props.searchProps} />
                        <BootstrapTable
                          keyField="id"
                          data={dataTwo}
                          columns={columnsTwo}
                          {...props.baseProps}
                          filter={filterFactory()}
                          pagination={pagination}
                          rowClasses={rowClasses}
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </>
  );
};

export default BugView;
