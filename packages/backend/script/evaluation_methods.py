import random

class EvaluationMethods:
    def monte_carlo_eval(self,prompt):
        """
        Simulate the Monte Carlo evaluation for a prompt.

        Parameters:
        prompt (str): The prompt to be evaluated.

        Returns:
        float: Average score representing the evaluation.
        """
        # Simulating different types of responses
        response_types = ['highly relevant', 'somewhat relevant', 'irrelevant']
        scores = {'highly relevant': 3, 'somewhat relevant': 2, 'irrelevant': 1}

        # Perform multiple random trials
        trials = 100
        total_score = 0
        for _ in range(trials):
            response = random.choice(response_types)
            total_score += scores[response]

        # Average score represents the evaluation
        return total_score / trials

    def elo_eval(self, prompt,base_rating=1500):
        """
        Simulate the Elo evaluation for a prompt.

        Parameters:
        prompt (str): The prompt to be evaluated.
        base_rating (int): Initial rating for the prompt.

        Returns:
        float: New rating based on the Elo evaluation.
        """
        # Simulate the outcome of the prompt against standard criteria
        outcomes = ['win', 'loss', 'draw']
        outcome = random.choice(outcomes)

        # Elo rating formula parameters
        K = 30  # Maximum change in rating
        R_base = 10 ** (base_rating / 400)
        R_opponent = 10 ** (1600 / 400)  # Assuming a fixed opponent rating
        expected_score = R_base / (R_base + R_opponent)

        # Calculate the new rating based on the outcome
        actual_score = {'win': 1, 'loss': 0, 'draw': 0.5}[outcome]
        new_rating = base_rating + K * (actual_score - expected_score)

        return new_rating

    def elo_ratings_func(self, prompts, elo_ratings, K=30, opponent_rating=1600):
        """
        Update Elo ratings for a list of prompts based on simulated outcomes.

        Parameters:
        prompts (list): List of prompts to be evaluated.
        elo_ratings (dict): Current Elo ratings for each prompt.
        K (int): Maximum change in rating.
        opponent_rating (int): Fixed rating of the opponent for simulation.

        Returns:
        dict: Updated Elo ratings.
        """
        for prompt in prompts:
            # Simulate an outcome against the standard criteria or another prompt
            outcome = random.choice(['win', 'loss', 'draw'])

            # Calculate the new rating based on the outcome
            actual_score = {'win': 1, 'loss': 0, 'draw': 0.5}[outcome]
            R_base = 10 ** (elo_ratings[prompt] / 400)
            R_opponent = 10 ** (opponent_rating / 400)
            expected_score = R_base / (R_base + R_opponent)
            elo_ratings[prompt] += K * (actual_score - expected_score)

        return elo_ratings


if __name__ == "__main__":
    eval_methods = EvaluationMethods()