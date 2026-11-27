---
title: "How to Evaluate a Multi-Turn Agentic System in PHP"
slug: "how-to-evaluate-a-multi-turn-agentic-system-in-php"
section: "neuron-ai"
permalink: "/how-to-evaluate-a-multi-turn-agentic-system-in-php/"
original_url: "https://inspector.dev/how-to-evaluate-a-multi-turn-agentic-system-in-php/"
date: "2026-09-01T17:18:09Z"
updated: "2026-09-01T17:18:10Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "SaaS", "Software development"]
tags: ["PHP", "neuron", "software development"]
description: "Evaluate agents that holds a conversation, calls tools, pauses to ask a human for approval in PHP with Neuron AI."
focus_keyword: "evaluations"
featured_image: "../images/how-to-evaluate-a-multi-turn-agentic-system-in-php/featured.png"
wp_id: 9935
---

When you build an agent that holds a conversation, calls tools, pauses to ask a human for approval, and then resumes, the hard question is not whether it runs. It is whether it is good, and how you can know that on demand. A multi-turn agentic system is one that carries state across several exchanges with a user, decides which tools to call and in what order, and sometimes waits for a human decision before it acts. Evaluating it means checking the whole path it took to get to an answer, not only the answer itself.

This is where evaluations differ from unit tests, and the difference is worth stating plainly. A unit test points inward. It pins down deterministic behavior you already control. An evaluation points outward. It is the instrument you use to negotiate expectations with the people who depend on the agent, while you keep changing it. The quality of an agent is probabilistic, so “it worked in the demo” is not a claim you can defend. A pass rate on a dataset is. That reframing is the whole point: evaluation turns a subjective “good enough” into a number a team can agree on and a threshold a business can put in front of a client.

A team building a production agent on Neuron recently asked us six precise questions about how to do this well. They are the right questions, and demand for this kind of granular evaluation keeps growing. The answers below use the evaluation suite that ships with Neuron v4, currently in beta. Each answer is a piece of the same architecture, so read them in order.

## Is there a recommended architecture for multi-turn evaluations?

Yes. Two objects carry the whole design: Conversation and Trajectory. Conversation drives your agent through a sequence of turns. Its run() method returns a Trajectory, a structured record of everything that happened during those turns: the user messages, the tool calls with their arguments and results, the approval decisions, and the final answer.

```php
$trajectory = Conversation::make(RefundAgent::make())
    ->withTurns(["I want a refund for order #123", "Yes, please confirm it"])
    ->run();
```

Everything else you evaluate, from tool calls to approvals to task completion, is a question you ask of that Trajectory. You do not inspect the agent’s internals. You inspect what it did.

## Do teams build their own conversation runners, or integrate an external platform?

In the past you built this by hand. You would drive the agent through the turns yourself, collect the chat history, and write custom assertions against Neuron’s message types. That path still exists, and the suite stays open: when you need a check that does not come in the box, you extend AbstractAssertion and implement a single evaluate() method that returns a pass or a fail with a score. But you should not have to rebuild the plumbing for every project.

In v4 the primitives are native. There is no external evaluation platform to wire in and no bespoke conversation runner to maintain. The value here is measured in the hours you do not spend: a hand-rolled evaluation harness is days of infrastructure code per project, plus the ongoing cost of keeping it in sync with the agent as it changes. Native primitives move that work off your plate so your evaluation code describes behavior, not machinery.

## How do you evaluate tool calls, interruptions, approvals, and resumed conversations?

With trajectory assertions and human-in-the-loop policies. Trajectory assertions ask questions about the tools the agent used. ToolWasCalled and ToolWasNotCalled check presence and absence, the second being your guardrail against an agent doing something it must never do. TrajectoryMatches checks a whole sequence against an expected one, and it takes a mode so you can be as strict or as lenient as the scenario deserves: strict for the exact order with nothing extra, unordered for the same calls in any order, subset when the expected calls must appear in order but extra calls in between are fine, and superset when nothing outside an allow-list may be called.

```php
$this->assert(new TrajectoryMatches(["search_orders", "refund_order"], Mode::Subset), $trajectory);
$this->assert(new ToolWasCalled("refund_order"), $trajectory);
```

Approvals are where most chat-based eval frameworks stop and where agentic systems actually live. You drive the human decisions from the evaluation itself with withApprovals, which receives each pending action and the trajectory so far, and returns a decision per action: approve it, or reject it with a reason. The decision can depend on the tool’s own arguments, so you can test that a refund above a limit gets rejected while everything else goes through.

```php
$trajectory = Conversation::make(RefundAgent::make())
    ->withTurns($turns)
    ->withApprovals(function (ApprovalRequest $request, Trajectory $soFar): array {
        $decisions = [];
        foreach ($request->getActions() as $action) {
            $decisions[$action->id] = $action->name === "refund_order";
                ? ["reject", "Amount exceeds the automatic refund limit"]
                : "approve";
        }
        return $decisions;
    })
    ->run();

$this->assert(new ToolWasRejected("refund_order"), $trajectory);
```

The rules are deliberately unforgiving, because silence is how agents cause incidents. If the agent suspends for an approval and you gave no policy, the run fails with an exception instead of quietly approving everything, and every pending action has to get an explicit decision. A rejected action is not a failure of the agent, it is a test of whether it recovers correctly.

## How do you keep scenarios independent from the agent’s internal implementation?

By asserting on observable behavior instead of internal events. Trajectory abstracts the raw message history into a small set of semantic queries. You ask it for the tool calls, for the final answer, or for a transcript to hand to an AI judge, and you write your expectations against those.

```php
$trajectory->toolCalls();
$trajectory->toolCalls("refund_order");
$trajectory->finalAnswer();
$trajectory->toTranscript();
```

This is what keeps a reusable evaluation suite from rotting. Because your assertions describe what the agent did and not how it is wired inside, you can refactor the agent’s internals, change its events, or reorganize its workflow, and your evaluations keep passing as long as the behavior holds. The rewrite you avoid is the rewrite of your own test suite every time you touch the agent.

## Are there existing examples, libraries, or judges that work well?

The suite is native and broad. Beyond the trajectory assertions there is a full set of string assertions, dataset loaders that read from arrays or JSON files, and output drivers that write results to the console, to JSON, or to a destination of your own. For quality that cannot be checked with a literal match, there is AI as a judge: a general AgentJudge you configure with criteria and a threshold, plus specialized judges for faithfulness, correctness, relevance, and helpfulness. If you work with coding agents, the /neuron-evaluation-engineer skill teaches them how to use and extend the suite, and a refund evaluator ships as a worked reference.

For a whole conversation, the judge that matters most is task completion. It reads the entire transcript, including the approval decisions and their reasons, and tells you whether the agent achieved the user’s goal.

```php
$this->assert(
    new TaskCompletionJudge($this->judge, goal: "Get a refund for order #123"),
    $trajectory
);
```

This is where the business value becomes concrete. A judge that scores goal completion across a dataset gives you a success rate, and a success rate is a number you can set a bar against. “The agent must complete the refund flow on at least this share of cases before we ship” is a decision a team can make together, and defend to a client, instead of arguing about impressions.

## Is native multi-turn or simulator-based evaluation planned?

It is not planned. It is already here in v4 beta. You do not have to script every conversation by hand: you can hand the user’s side of the conversation to a simulated user with a persona and a goal, and let it talk to your agent.

```php
$user = UserSimulator::make()
    ->withPersona("An impatient customer who gives short answers")
    ->withGoal("Get a refund for order #123");

$trajectory = Conversation::make(RefundAgent::make())
    ->withUser($user, maxTurns: 10)
    ->run();
```

The simulator replaces the scripted turns rather than adding to them, so a scenario is either scripted or simulated, never both. You set a maximum number of turns, the simulator decides when its goal has been met, and it stays out of the approval loop so the agent and the human approver remain cleanly separated. It is an ordinary Neuron agent underneath, which means you can run it on a cheaper model to keep the cost of large evaluation runs down.

## The point of all this

An application born agentic is not finished when it works once in front of you. It is finished when you can say, on demand and with a number, whether it still works after the next change. Adding an agent to a codebase is easy. Knowing that the agent is right, and proving it to the people who rely on it, is the part that decides whether it reaches production. Evaluation is that proof.

Here is the whole architecture in one evaluator: a dataset drives the turns and the approval decisions, the conversation runs with human-in-the-loop, and a mix of trajectory assertions and a task-completion judge grades the result.

```php
class RefundConversationEvaluator extends BaseEvaluator
{
    private AgentInterface $judge;
    
    public function setUp(): void
    {
        $this->judge = JudgeAgent::make();
    }
    
    public function getDataset(): DatasetInterface
    {
        return new JsonDataset(__DIR__ . "/datasets/refunds.json");
    }

    public function run(array $datasetItem): mixed
    {
        return Conversation::make(RefundAgent::make())
            ->withTurns($datasetItem["turns"])
            ->withApprovals(function (ApprovalRequest $request, Trajectory $soFar) use ($datasetItem): array {
                $payload = [];
                foreach ($request->getActions() as $action) {
                    $payload[$action->id] = $datasetItem["decisions"][$action->name] ?? "approve";
                }
                return $payload;
            })
            ->run();
    }

    public function evaluate(mixed $trajectory, array $datasetItem): void
    {
        $this->assert(new TrajectoryMatches($datasetItem["expected_tools"], Mode::Subset), $trajectory);
        $this->assert(new ToolWasRejected("refund_order"), $trajectory);
        $this->assert(new StringContains("cannot"), $trajectory->finalAnswer());
        $this->assert(new TaskCompletionJudge($this->judge, goal: $datasetItem["goal"]), $trajectory);
    }
}
```

Your next application will be agentic. Build it in PHP, and build it as something you can measure. If you are starting a new agentic project now, start on v4: the evaluation suite is already there, and so is everything else you need to take an agent from a promising demo to a system you can stand behind.
