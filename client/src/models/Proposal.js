export default function Proposal(id, userId, processId, description, cost, preference = null) {
  this.id = id;
  this.userId = userId;
  this.processId = processId;
  this.description = description;
  this.cost = cost;
  this.preferences = null;
  this.approved = null;
  this.preference = preference;
}

export function ApprovedProposal(id, description, cost, preferences, user) {
  this.id = id;
  this.description = description;
  this.cost = cost;
  this.preferences = preferences;
  this.user = user;
}
