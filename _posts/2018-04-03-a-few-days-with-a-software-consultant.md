---
layout: post
title: A few days with a software consultant
---

We started to implement domain driven design (DDD) at my workplace at the start of last year. I had learned a lot about DDD in my spare time, but no one on the team had worked on a DDD project beforehand.

We decided to hire [Marco Pivetta (@ocramius)](http://ocramius.github.io/about/) as a consultant for this reason. We wanted him to have a look at the DDD code that we had already written and we wanted to review the theory with him. We wanted to make sure that we had a solid foundation before we started to move other parts of the application over to DDD.

Marco started the first day with his CQRS and Event Sourcing workshop. He went over command query responsibility segratation (CQRS), a little domain driven design and event sourcing. I had encountered all those topics previously, but I still learned a lot on that day.

## Event sourcing

Because of the workshop, we started to use event sourcing for some of the new parts of our application. At first we thought that it would be a lot of work to use it, but we already had audit log events and it was an easy change.

When you use event sourcing, you store all the changes that happened in your system. Not just the current state. 

Looping through all events just to read some data is not efficient, which is why we also keep the current state in the database. These tables are called projections and when an event is recorded, the projections get updated.

We were doing a big change to our data model and there is a lot of legacy code that reads from the affected tables. With event sourcing, we can keep both the new and old table up to date with very little work. It will also be easy to get rid of the legacy projection once all that code is migrated.

To illustrate the idea, let's have a look at some pseudo-code for a social news website (like reddit or hackernews).

```php?start_inline=1
final class Post extends Aggregate
{
    public function upvote(): void
    {
        $this->record(new PostWasUpvoted($this->id));
    }
}

final class PostRepository
{
    private $eventStore;
    private $postProjection;
    
    public function __construct(
        EventStore $eventStore, 
        PostProjection $postProjection
    ) {
        $this->eventStore = $eventStore;
        $this->postProjection = $postProjection;
    }
    
    public function save(Post $post): void
    {
        foreach ($post->getRecordedEvents() as $event) {
            $this->eventStore->record($event);
            $this->postProjection->record($event);
        }
    }
}

final class DbalPostProjection implements PostProjection
{
    public function record(Event $event): void
    {
        if ($event instanceOf PostWasUpvoted) {
            // update database table
        }
    }
}
```

That's a very simple way to implement event sourcing and projections. There are other ways to do it. You could also use an already existing solution like [Prooph](http://getprooph.org/).

## Event storming

On the second day, we focused on [event storming](http://verraes.net/2015/03/event-storming-storytelling-visualisations/). We had done a few sessions in the previous weeks and we were not sure whether we were doing it right. We had stickers on the wall, but the end result wasn't really coherent.

In our own attempts, we grouped everything around entities. With Marco, we focused on the business processes instead which made much more sense.

## Behavior-driven development

After event storming for a while, we recognized a a problem that we couldn't solve with this approach. We were going to refactor and expand our access management and it was just not possible to visualize the important bits and pieces with event storming. To solve these issues, Marco introduced us to the [Gherkin](https://cucumber.io/docs/reference) language.

```
Feature: Check in and out of a building

  Scenario: Register a building
    When I register a new building
    Then a new building should have been registered

  Scenario: A user can check into a building
    Given a building was registered
    When a user checks into the building
    Then the user should have checked into the building

  Scenario: A user can check out of a building
    Given a building was registered
    And a user has checked into the building
    When a user checks out of the building
    Then the user should have checked out the building

  Scenario: A user that checks twice into a building causes an anomaly
    Given a building was registered
    And a user has checked into the building
    When a user checks into the building
    Then the user should have checked into the building
    And a check-in anomaly should have been detected
```

These tests are taken from Marco's [CQRS and Event Storming workshop](https://github.com/ShittySoft/php-fwdays-2017-cqrs-es-workshop).

Gherkin is not only a way to describe the behaviour of an application, but you can also test your application with it. You can turn each line into it's own test method with [Behat](http://behat.org).

We have used Gherkin and Behat tests on all our new code and we are really happy with it. It is very easy to spot an error in the business logic and very easy to add and modify tests. They are not our only tests, but they became an important piece of our test suite.

## The workshop

On the third and last day, we put the focus on the developers. We started by working through the [CQRS and Event Storming workshop exercises](https://github.com/ShittySoft/php-fwdays-2017-cqrs-es-workshop) by ourselves to make sure that we understood everything.

Even if you can't make it to one of Marco's workshop, you can still do the coding exercises of the workshop. Start by watching this [video](https://www.youtube.com/watch?v=RfnySciLUhc). After that, read the readme file of the Github repository to get started and use the open pull requests as guidance.

When we finished the coding exercises, we moved on to our own codebase. We were introduced to the command bus earlier and we decided to implement one ourselves.

We were already splitting our application services into separate reader and writer classes. That made it easy to switch to a command bus. We wrote the command bus implementation together with Marco and then refactored one of our existing writer services into a command handler.

We ended the day with a questions and answers session.

## Finishing thoughts

The three days were very good for our team. I learned a lot and so did my coworkers. A year has passed and I can say, with the benefit of hindsight, that it was definitely worth it.

My book [Professional PHP](/professional-php) was almost completed when the consulting occurred, but I ended up rewriting a big part of it. The things that I learned from Marco made a lot of sense to me and I couldn't just leave them out. This pushed back the release date by a few months, but it was definitely worth it and I can still stand 100% behind the content now.
