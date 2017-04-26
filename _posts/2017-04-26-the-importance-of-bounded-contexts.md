---
layout: post
title: The Importance of Bounded Contexts
---

In the last six months I immersed myself in domain driven design (DDD). I read the green (DDD Distilled) and red (Implementing DDD) books by Vaughn Vernon, read all the blogposts and watched all the talks that I could find.

I was already used to programming with entities and repositories, but there were a few key lessons that I took away from DDD which helped the quality of my code a lot.

One problem that I've seen in every team that I've worked on so far were monster entities. Even though the applications were in different domains, they all had a select few entities that just kept growing larger.

When I learned about the importance of having bounded contexts, the problem revealed itself. We were trying too hard to focus on DRY (don't repeat yourself) by only having one entity. Let's take one example, a product entity in an e-commerce shop.

This `Product` entity contained everything about a product. From all the information that was displayed in the frontend to keeping track of the stock in the backend.

What we failed to see was that an `Product` in the shop context was not the same as a product in the admin area or in the API for the warehouse. The only thing they had in common was the name `Product`, the identity and a few fields. The business logic was completely different for each bounded context, but we had everything forced into the same bloated entity.

The solution was simple, we started to split the bounded contexts into their own folders, each one of them has it's own subfolders for the application, domain and infrastructure layers (we keep the presentation layer separate for now). We focused on having high cohesion inside the contexts and low coupling between the contexts, keeping the entities small and tailored towards their context.

The result has been much cleaner code and fewer headaches. I can't believe that it took so many years to come to this realization. I think the problem was a result of just blindly relying on an ORM without thinking about the bigger picture.

Hopefully you got something out of this post that will help you improve your own code. If you are using an ORM, you can probably relate to my experiences.

There were a few other important lessons that I learned from DDD, so stay tuned for the follow-up posts.
