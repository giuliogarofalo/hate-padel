import { determineWinner, playGame, playSet, playMatch } from './paddle'
import {describe, expect, test} from '@jest/globals';

test("everything", ()=> {
    describe('determineWinner', () => {
        it('should return 1 or 2 based on team experience', () => {
          const winner = determineWinner(5, 3);
          expect(winner).toBeGreaterThanOrEqual(1);
          expect(winner).toBeLessThanOrEqual(2);
        });
      });
      
      describe('playGame', () => {
        it('should return the winner of a single game', () => {
          const winner = playGame(5, 3);
          expect(winner).toBeGreaterThanOrEqual(1);
          expect(winner).toBeLessThanOrEqual(2);
        });
      });
      
      describe('playSet', () => {
        it('should return the winner of a set', () => {
          const winner = playSet(5, 3);
          expect(winner).toBeGreaterThanOrEqual(1);
          expect(winner).toBeLessThanOrEqual(2);
        });
      });
      
      describe('playMatch', () => {
        it('should return the winner of a match', () => {
          const winner = playMatch('Team 1', 5, 'Team 2', 3, 3);
          expect(winner).toBeGreaterThanOrEqual(1);
          expect(winner).toBeLessThanOrEqual(2);
        });
      });
      
})
