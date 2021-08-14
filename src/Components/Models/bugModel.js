export default bug;

function bug(bug) {
  let priorityValue = "";
  if (bug.priority == 1) {
    priorityValue = "High";
  } else if (bug.priority == 2) {
    priorityValue = "Medium";
  } else if (bug.priority == 3) {
    priorityValue = "Low";
  } else if (bug.priority == "High") {
    priorityValue = "High";
  } else if (bug.priority == "Medium") {
    priorityValue = "Medium";
  } else if (bug.priority == "Low") {
    priorityValue = "Low";
  }

  if (bug !== undefined) {
    this.id = bug.id;
    this.name = bug.name;
    this.details = bug.details;
    this.steps = bug.steps;
    this.version = bug.version;
    this.priority = priorityValue;
    this.assigned = bug.assigned;
    this.creator = bug.creator;
    this.project = bug.project;
    this.status = bug.status;
    this.type = bug.type;
  }
}
