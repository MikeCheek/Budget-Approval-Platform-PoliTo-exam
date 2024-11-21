export default function Preference(userId, proposalId, score = 0) {
  this.userId = userId;
  this.proposalId = proposalId;
  this.score = score;
}
