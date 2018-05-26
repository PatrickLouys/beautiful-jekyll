---
layout: post
title: Tell, don't ask
---

When I started programming, I thought that object oriented programming was about using classes and inheritance. It took me a few years to realize that there was much more to it.

The following example is taken from Symfony's [documentation](http://symfony.com/doc/current/doctrine.html).

```php?start_inline=1
public function index()
{
    // you can fetch the EntityManager via $this->getDoctrine()
    // or you can add an argument to your action: index(EntityManagerInterface $entityManager)
    $entityManager = $this->getDoctrine()->getManager();

    $product = new Product();
    $product->setName('Keyboard');
    $product->setPrice(1999);
    $product->setDescription('Ergonomic and stylish!');

    // tell Doctrine you want to (eventually) save the Product (no queries yet)
    $entityManager->persist($product);

    // actually executes the queries (i.e. the INSERT query)
    $entityManager->flush();

    return new Response('Saved new product with id '.$product->getId());
}
```

The documentation just explains how to use an ORM and the example code does exactly that. The problem is that many new developers take framework documentation as an example of good code. Often they model their own code after examples like the above.

In this example, the `Product` object is not that different from an array. We get some benefits from having type declarations and setter, but it's not a good example of object oriented programming.

The example is relatively harmless, but let's take the approach further. Imagine that the following code is used to reduce the stock of a product (after it has been purchased by a customer).

```php?start_inline=1
// This data comes from the cart
$productId = 1;
$amount = 3;

$product = $repository->find($productId);
$newStock = $product->getStock() - $amount;
$product->setStock($newStock);
```

I have seen a lot of code like this in production and I have written my fair share of it in the past. We are using classes and methods, but this is procedural code.

> "Procedural code gets information then makes decisions. Object-oriented code tells objects to do things."
>
> Alec Sharp

In the previous example, we fetch data and then manipulate it. To make the code object-oriented, we have to move the logic into a method of the `Product` class.

```php?start_inline=1
$newStock = $product->decrementStock($amount);
```

The stock information is now encapsulated in our object. Before we had to read from the object state and then write back to it. Now we just tell the object what we want it to do ("decrement the stock").

Code becomes much more meaningful when it follows "tell, dont' ask". Setters and getters doesn't tell us much about an object and how we should interact with it. Methods like `decrementStock()` communicate their purpose much better.

Let's have a look at another example.

```php?start_inline=1
$invoicedAmount = new Money(50);
$paidAmount = new Money(50);

if ($invoicedAmount->getAmount() === $paidAmount->getAmount()) {
    // do something
}
```

The problem is a little less obvious than in the first example, but we are still accessing state from the object and using it to make a decision.

It's very easy to move the comparison logic into it's own method.

```php?start_inline=1
if ($invoicedAmount->equals($paidAmount)) {
    // do something
}
```

This might look like overengineering, but I have been burned too many times by this example to not mention it. The comparison logic can change and if it does, you will spend a lot of time combing through your codebase.

To demonstrate this, let's add currency information to our money object.

```php?start_inline=1
$invoicedAmount = new Money(50, new Currency('CHF'));
$paidAmount = new Money(50, new Currency('CHF'));

if ($invoicedAmount->getAmount() === $paidAmount->getAmount() && 
    $invoicedAmount->getCurrency()->getCode() === $paidAmount->getCurrency()->getCode()
) {
    // do something
}
```
With an `equals()` method, we only have to refactor code in a single place when the logic changes. Encapsulating your logic in methods makes it easy to reuse code. 

Sometimes it's not immediately obvious to which class a method belongs to. If that is the case, create it on the class which has the most information available (see [information expert](https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)#Information_expert)).

When you start to encapsulate all your logic together with the data, you might notice that some entities will grow really large. A `Product` class in an online shop will quickly accumulate a lot of lines of code.

If you notice this in your application, consider splitting it up into separate [bounded contexts](/2017/04/26/the-importance-of-bounded-contexts/). You don't have to limit yourself to a single `Product` class that is responsible for everything.
