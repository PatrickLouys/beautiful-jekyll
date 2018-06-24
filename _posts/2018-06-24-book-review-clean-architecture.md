---
layout: post
title: "Book Review: Clean Architecture by Robert C. Martin"
---

This is a review of the book [Clean Architecture](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164) by Robert C. Martin. 

![The book]({{ site.url }}/public/clean-architecture.jpg)

A quick disclaimer before we start: My views on software development are heavily influenced by Uncle Bob through some of his earlier works, most notably his book [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship-ebook/dp/B001GSTOAM) and his talk [Architecture the Lost Years](https://www.youtube.com/watch?v=WpkDN78P884).

The book starts with an explanation of why software architecture is important. It comes down to the fact that is easy to create working software, but it is hard to create software that stays maintainable over many years. The following quote sums it up well:

> "The goal of software architecture is to minimize the human resources required to build and maintain the required system."
>
> Robert C. Martin

This quote really resonated with me. It is just as easy to overengineer a system as it is to underengineer one. You have to find the right balance for each project.

Another good takeaway was that developers are stakeholders in the project too. It's not all about the business people. As a developer, you have the right and responsibility to speak up. Sometimes you have will have to fight for the architecture.

This is something that I wish more developers had the guts to do. Projects are often rushed from one artifical deadline to the next one and there is never time to clean up the mess that was created.

In the following chapters, Uncle Bob talks about the main programming paradigms and how the SOLID principles are applied to software architecture. 

He mentions that good architecture keeps options open. You want to defer important decisions into the future as long as possible. You will have more information in the future and you will make better decisions if you wait.

Uncle Bob suggests that you should build your architecture around use cases and entities. 

In the center of your application you have entities. They encode the business rules of the application. The entities are wrapped with a layer of use cases. They describe how the outside world can interact with the application.

![The inner layers]({{ site.url }}/public/clean-architecture-inner-layers.jpg)

His approach is almost identical to what the domain driven design (DDD) community teaches. They use different names, but the same layers and concepts are present. You have a domain layer that contains the entities and an application layer that contains commands and queries.

If you want to see an example of this architecture, have a look at the [sample code](https://github.com/PatrickLouys/professional-php-sample-code) from my book [Professional PHP](/professional-php).

With Robert C. Martin's suggested architecture, only the domain and application are important. The database is a detail. The web is a detail. The frameworks is a detail.

He mentions that his use case architecture can't be used together with a framework based architecture. You have to decouple yourself from your framework and other third party code. 

Uncle Bob thinks that frameworks can be useful, but only as long as you decouple your own code from them. Don't extend framework classes and don't create any direct dependencies on framework classes from your inner layers. Use frameworks, but don't couple yourself to them.

There is an additional chapter by Simon Brown where he talks about his preferred way of organizing code. He argues against simply creating a folder for each layer and putting all your classes into them. Instead, he suggests that you should package by component instead. 

With Simon's approach, you create a web package that uses your application packages. Every application package contains folders for it's layers. Only the use cases are public and accessible from the web package.

![By package]({{ site.url }}/public/by-package.jpg)

This is very similar to the concept of [bounded contexts](TODO: link) from domain driven design. We have been using this approach at my workplace for a while and it works really well from our experience.

It was one of the better programming books that I have read so far. It reads better than Clean Code, the chapters are short and and to the point.

I can highly recommend it for everyone who has been developing for a few years and wants to learn more about architecture.

