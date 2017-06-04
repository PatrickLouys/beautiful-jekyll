---
layout: post
title: Value Objects Explained
---
In ["The Importance of Bounded Contexts"](/2017/04/26/the-importance-of-bounded-contexts/) I talked about one of the big lessons that I learned from domain driven design (DDD). But separating code by bounded context was only one of the things that I learned and improved my code at the same time. Today I want to talk about another one of those.

The topic of today are value objects. As the name suggests, these objects represent a value. The idea of value objects has been around for much longer than DDD and their use is not limited to the domain layer. You can, and should, use them everywhere in your object oriented code.

## Enforcing preconstraints

When we do object oriented programming, we want to create proper abstractions. Let's take a color for example. A particular RGB color could be represented by three integers, but they fail to properly represent the idea of a color.

If we use an integer, there is no way for us to enforce validate that the RGB color is always valid. We know that the red, green and blue values always have to be between 0 and 255. If we use a value object, we can enforce this in the constructor.

```php
final class Color
{
    private $red;
    private $green;
    private $blue;

    public function __construct(int $red, int $green, int $blue)
    {
        foreach ([$red, $green, $blue] as $color) {
            if ($color < 0 || $color > 255) {
                thrown new InvalidArgumentException(
                    'Color values must be between 0 and 255'
                );
            }
        }

        $this->red = $red;
        $this->green = $green;
        $this->blue = $blue;
    }
}

```

Let's say that we want to create a function that allows us to represent our color in the common HTML hex format (`#337ab7` for example). If we didn't have a value object, this is how the code could look like.

```php
function convertRgbToHex(int $red, int $green, int $blue): string
{
    foreach ([$red, $green, $blue] as $color) {
        if ($color < 0 || $color > 255) {
            thrown new InvalidArgumentException(
                'Color values must be between 0 and 255'
            );
        }
    }

    return '#'
        . sprintf('%02x', $red)
        . sprintf('%02x', $green)
        . sprintf('%02x', $blue);
}
```

As you can see, every function that uses colors has to do it's own validation. This leads to a lot of duplicate code and violates the don't repeat yourself (DRY) principle.

## Bundle your logic together with your data

We can improve our `convertRgbToHex()` function by using the color value object instead.

function convertColorToHex(Color $color): string
{
    return '#'
        . sprintf('%02x', $color->getRed())
        . sprintf('%02x', $color->getGreen())
        . sprintf('%02x', $color->getBlue());
}

This approach deduplicates the code and is a big improvement compared to the earlier example, but we can still improve it.

You often see code like this from developers who are relatively new to object oriented programming. They still think procedurally and they keep their data structures and logic separate. This often manifests itself in a lot of services and objects that mostly consist of getters and setters.

Using a lot of primitive values leads to procedural code because you are not bundling your logic together with the data. This is a violation of the basic object oriented principle ["tell, don't ask"](https://martinfowler.com/bliki/TellDontAsk.html).

We can use the [information expert principle](https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)#Information_expert) to decide where a method belongs to. In our case, the color value object is the correct place because it contains all the information that is required.

```php
final class Color
{
    // constructor etc...

    public function toHexString(): string
    {
        return '#'
            . sprintf('%02x', $this->red)
            . sprintf('%02x', $this->green)
            . sprintf('%02x', $this->blue);
    }
}

```

It can take a while to make the mental shift from procedural to OOP, even if you have used objects for years. But the end result is code that is much easier to maintain and it's always easy to find the appropriate methods - they are part of the object itself and not scattered around your codebase.

## Improving code readability

Primitive obsession is a design smell. I'm not saying that you should never use primitives, but you shouldn't use them by default for all your parameters. They can't represent a custom type properly. When you typehint for an `int` or `string`, there is no additional information communicated besides the scalar type.

```php
public function drawPixel(int $x, int $y, int $red, int $green, int $blue);
```
The code above is a good example of primitive obsession. It might look reasonable from this perspective, but let's see how this code is being used from the outside.

```php
// if you write it like this, it is still readable
$canvas->drawPixel($x, $y, $red, $green, $blue);

// when you have hardcoded values, it becomes messy and you have to count
// the parameters to make sure which one is which
$canvas->drawPixel(50, 25, 31, 132, 255);
```
We can improve that code by using value objects.

```php
$canvas->drawPixel(new Coordinate($x, $y), new Color($red, $green, $blue));

$canvas->drawPixel(new Coordinate(50, 25), new Color(31, 142, 255));
```
This makes it much easier to read the code and at the same time, we reduce the number of parameters that the method needs. The version that was only using scalar values would have required a docblock that would explain all the method parameters. With the value objects the code is now self-documenting and less prone to errors.

If you have been developing for a while, I'm sure that you have come across of a couple of bugs that were the result of a wrong parameter order. If those parameters are of the same type, the bug can often go unnoticed for a while and those bugs can be hard to discover.

Of course you can go even further and add separate value objects for every single value.

```php
$canvas->drawPixel(
    new Coordinate(
        new X(50),
        new Y(25)
    ),
    new Color(
        new Red(31),
        new Green(142),
        new Blue(255)
    )
);

```

This approach makes it impossible to mix up the parameter order and it's even more readable than the earlier example. But it also requires you to write much more code.

Where you end up drawing the line is up to you and of course it also depends on the project that you are working on. If it's a really mission-critical part of your application, then I would go much more fine-grained with the value objects compared to a less critical part.

A good rule of thumb is that you should never use primitives for the type declarations of your business logic methods.

## Immutability

Let's assume that we have two different pixels and they both share the same color.

```php
$color = new Color(31, 142, 255);

$canvas->drawPixel(new Coordinate(50, 25), $color);
$canvas->drawPixel(new Coordinate(100, 50), $color);
```
But now we want to modify the second color before we draw the pixel.

```php
public function removeRed(): void
{
    $this->red = 0;
}
```

```php
$color = new Color(31, 142, 255);
$canvas->drawPixel(new Coordinate(50, 25), $color);

$color->removeRed();
$canvas->drawPixel(new Coordinate(100, 50), $color);
```
If our color object is mutable, this will not only change the second one, but also the first one. Value objects should always be immutable.

Immutability makes it much easier to reason about code. Mutable value objects are a good way to introduce bugs into your codebase. If you have worked with PHP's `DateTime` object (before `DateTimeImmutable` came around), you probably experienced this problem yourself. Someone adds a `$date->modify('+1 day')` somewhere and then a completely different part of the code breaks just because it was using the same `DateTime` instance. Of course you can manage these bugs by carefully managing state and using `clone` when they get injected, or you could just make them immutable and avoid the problems.

So how do you make a value object immutable? PHP doesn't have native support for immutable classes and properties yet, but you can choose to not manipulate any object state from it's methods. So we change our `removeRed()` method to the following.

```php
public function removeRed(): Color
{
    return new Color(0, $this->green, $this->blue);
}
```

To make it immutable, we don't modify the state and instead return a new object.

```php
$color = new Color(31, 142, 255);
$canvas->drawPixel(new Coordinate(50, 25), $color);

$color = $color->removeRed();
$canvas->drawPixel(new Coordinate(100, 50), $color);
```

## Performance concerns

Some developers use performance as an excuse for not using value objects in their code. They argue that boxing/unboxing them takes away precious CPU cycles.

If your code is talking to a database, then this argument is pretty pointless. A database query is orders of magnitudes slower than boxing and unboxing a bunch of value objects.

But let's assume that you are working on an application where it is all about performance and the negligible performance hit of using value objects actually does make a difference. If that is really the case (which in 99.9% it won't be), then I would question your choice of PHP as the right tool for this particular job.

Opting to not use value object for performance reasons is just premature optimization. You are trading readable code against a very small perfomance gain. If you are worried about performance, you should benchmark your code and fix the bottlenecks that make it slow. Rinse and repeat until it is fast enough.

## Summary

Value objects are a very important building block of object oriented code. It doesn't matter whether you are using domain driven design or not.

If you are not using them in your code already, try to find a few cases where you can replace one or more primitive values with a value objects. If you can move some logic into the object, even better.


