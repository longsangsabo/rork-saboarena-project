import { createTRPCRouter } from "./create-context";
import { getUserProfile, updateUserProfile } from "./routes/user/profile/route";
import { getUserGameData, updateUserStats } from "./routes/user/game-data/route";
import { getTournaments, joinTournament } from "./routes/tournaments/list/route";
import { getTournamentDetails, updateTournamentStatus } from "./routes/tournaments/management/route";
import { getClubs, getClubMembers, joinClub } from "./routes/clubs/list/route";
import { getClubDetails, getClubLeaderboard, leaveClub, updateMemberRole } from "./routes/clubs/management/route";
import { createClubTournament, getClubTournaments } from "./routes/clubs/tournaments/route";
import { getChallenges, createChallenge, likeChallenge, joinChallenge } from "./routes/challenges/list/route";
import { getFeed, interactWithPost } from "./routes/social/feed/route";
import { rankingRouter } from "./routes/ranking/route";

export const appRouter = createTRPCRouter({
  user: createTRPCRouter({
    getProfile: getUserProfile,
    updateProfile: updateUserProfile,
    getGameData: getUserGameData,
    updateStats: updateUserStats,
  }),
  tournaments: createTRPCRouter({
    list: getTournaments,
    join: joinTournament,
    details: getTournamentDetails,
    updateStatus: updateTournamentStatus,
  }),
  clubs: createTRPCRouter({
    list: getClubs,
    getMembers: getClubMembers,
    join: joinClub,
    details: getClubDetails,
    leaderboard: getClubLeaderboard,
    leave: leaveClub,
    updateMemberRole: updateMemberRole,
    createTournament: createClubTournament,
    getTournaments: getClubTournaments,
  }),
  challenges: createTRPCRouter({
    list: getChallenges,
    create: createChallenge,
    like: likeChallenge,
    join: joinChallenge,
  }),
  social: createTRPCRouter({
    getFeed: getFeed,
    interact: interactWithPost,
  }),
  ranking: rankingRouter,
});

export type AppRouter = typeof appRouter;