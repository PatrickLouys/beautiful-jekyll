---
layout: post
title: Simplify Your Code With Query Objects
---

Did you ever have problems with repository classes that just kept on growing over the years, with no end in sight?

This is a problem that I have encountered in multiple projects and companies. Usually the repository starts out small, but then more and more methods are added over time.

Let's assume that we are working on an online shop. In the beginning, our `OrderRepository` is very small and we just have a few methods.

```php?start_inline=1
interface OrderRepository
{
    public function find(OrderId $orderId): ?Order;

    public function findAll(Filters $filters): Orders;

    public function save(Order $order): void;
}
```

You keep working on the application and the business is doing well. A lot of orders are coming in and there are now too many to display on a single page. You add a few method to add pagination support.

```php?start_inline=1
interface OrderRepository
{
    public function find(OrderId $orderId): ?Order;

    public function findAll(Filters $filters, PaginationParameters $paginationParameters): Orders;

    public function countTotal(): int;

    public function countFiltered(Filters $filters): int;

    public function save(Order $order): void;
}
```

Two weeks later, the accounting department approaches you because they need a new page that shows all the orders with invoices that haven't been paid yet. 

You add another method to the repository and create the page.

```php?start_inline=1
public function findWhereInvoiceWasNotPaid(): Orders;
```

A month later, the marketing department needs a new feature...

 You can see where I am going with this, the repository just keeps on growing. After a few years, it becomes hard to stay on top of things and your repository grows larger and larger.

Stuffing everything into a single repository leads to problems, but what are the alternatives?

You could split it up into multiple repositories, but then it will be hard to distinguish between them. How do you name all the repositories? How do you decide to which one a method belongs?

This is where query objects come into play. You take one of the methods and turn it into it's own object.

```php?start_inline=1
interface OrdersWhereInvoiceWasNotPaidQuery
{
    public function execute(): Orders;
}
```

Before, your classes always had to depend on the large repository class. Now they can depend on the few queries that they actually need (often it's just one).

Software development is all about making tradeoffs. Query objects make your code simpler, but they also have a couple of drawbacks.

The obvious one is that you have to create more classes. This is not necessarily a bad thing. It's the same as when you follow the single responsibility principle. You end up with many small and cohesive classes.

It's also harder to deduplicate code between query objects. This is a little more annoying. With a single repository, you can just extract code into a private method. With query objects, you have to extract the duplicate code into a separate class.

Don't replace your repositories with query objects. Use them both and put the query where it makes most sense. If you only need to read data, put it into a query object. If you need to read and write, the repository is probably the right place. I use both repositories and query objects in the tutorial part of my book [Professional PHP](/professional-php/).

Query objects work really well in applications that follows the command query responsibility segregation pattern (CQRS). You use them on the query side and repositories on the command side. I really like this approach, because it completely decouples my queries from the business logic.
