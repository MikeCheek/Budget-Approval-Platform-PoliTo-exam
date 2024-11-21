export default function Proposal(id, userId, processId, description, cost) {
  this.id = id;
  this.userId = userId;
  this.processId = processId;
  this.description = description;
  this.cost = cost;
  this.preferences = null;
  this.approved = null;
}
