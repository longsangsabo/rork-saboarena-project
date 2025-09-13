import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { getUserProfile, updateUserProfile } from "./routes/user/profile/route";
import { getTournaments, joinTournament } from "./routes/tournaments/list/route";
import { getClubs, getClubMembers, joinClub } from "./routes/clubs/list/route";
import { getChallenges, createChallenge, likeChallenge } from "./routes/challenges/list/route";
import { getFeed, interactWithPost } from "./routes/social/feed/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  user: createTRPCRouter({
    getProfile: getUserProfile,
    updateProfile: updateUserProfile,
  }),
  tournaments: createTRPCRouter({
    list: getTournaments,
    join: joinTournament,
  }),
  clubs: createTRPCRouter({
    list: getClubs,
    getMembers: getClubMembers,
    join: joinClub,
  }),
  challenges: createTRPCRouter({
    list: getChallenges,
    create: createChallenge,
    like: likeChallenge,
  }),
  social: createTRPCRouter({
    getFeed: getFeed,
    interact: interactWithPost,
  }),
});

export type AppRouter = typeof appRouter;