---
title: "Laravel Notification vs Laravel Mailable - Which Is Better?"
slug: "laravel-notification-vs-laravel-mailable-what-is-better"
section: "inspector"
permalink: "/laravel-notification-vs-laravel-mailable-what-is-better/"
original_url: "https://inspector.dev/laravel-notification-vs-laravel-mailable-what-is-better/"
date: "2025-02-18T11:57:59Z"
updated: "2025-02-18T20:49:07Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development", "Troubleshooting", "Tutorials"]
tags: ["Laravel", "PHP", "software development"]
description: "Learn the difference between Laravel notification an mailable class. Send notifications via slack, sms, or just simple email messages."
focus_keyword: "laravel notification"
featured_image: "../images/laravel-notification-vs-laravel-mailable-what-is-better/featured.jpg"
wp_id: 7505
---

It doesn't matter what kind of application your a building. Usually you need a way to let user know what's going on, whether that's in app notifications, or forwarding messages to external platform like Slack, Telegram, Email, etc.

Laravel makes incredibly easy to send emails and notifications. Since you can use notifications to send email too, it can get a little bit confusing.

Let's take a look at when you would reach for one over the other.

## Laravel Notification vs Email - When to use which

Laravel notification can send email to your users, but notifications are going to be a little bit more flexible, a little bit more customizable than your traditional Laravel Mailable system.

The Laravel Notification system is more like a framework to allows you to send messages to the user through a variety of delivery channels, and Email is just an option. The Mailable system is just for sending email. That's it.

So if you're just sending email to your users, would you reach for notification over email?

Well, maybe it all depends by on your personal preferences, as well as your company's or team's structure on how you want to reach for notification or mailable.

Let's go ahead and build something so we can see when notifications might be a great option because we can use their flexibility in the future, and when a simple Email is just fine.

Let's say we have an application where people can register for local meetups. The people who are registering for a particular meetup, entering their name, entering their email, they are not necessarily users within your application. But you might have organizers for each individual meetup to be able to create their own meetups for people to register for.

And maybe they want to have a way of receiving people's information who have registered to attend a meetup.

You kind of have two different type of users: people who might not necessarily be authenticated users. But you will have organizers who are authenticated users instead.

Maybe we can send a notification to an organizer when someone registers for a meetup. And we can send a simple email to the guy who want participate to the meetup with all the details to join the event.

This example is intended to better understand when customizations or expandability in the future might be useful choosing notifications over mailables.

We will focus on the backend implementation. Consider the Controller below to create a new meetup:

```php
class MeetupController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'meetup_id' => 'required',
            'name' => 'required',
            'email' => 'required|email',
        ]);

        $meetup = Meetup::findOrFail($request->meetup_id);

        $guest = $meetup->guests()->create([$request->only('name', 'email')]);

        // Notify organizer

        return view('meetup', compact('meetup'));
    }
}
```

When a guest register they are not authenticated. We're just asking for their name and an email.

Now we want notify the organizer about the new attendee. You can use the command below to create a new Notification class:

```bash
php artisan make:notification NewMeetupSignup
```

Let's take a look at the notification class:

```php
class NewMeetupSignup extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }
}
```

Notifications can be extremely customizable, extremely flexible. We're are really touching only one aspect, sending email through Notification. So be sure to [checkout the docs](https://laravel.com/docs/master/notifications) for other ways to use notifications. From sending SMS, be able to send Slack messages, and even a ton more through third party implementation as well.

Furthermore they can be forwarded into multiple channels at the same time. You can specify the channels you want to use into the **via()** method. They can be just email or more.

You will need a method for each channel to build the message in the appropriate format.

```php
class NewMeetupSignup extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'slack'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the slack representation of the notification.
     */
    public function toSlack(object $notifiable): MailMessage
    {
        return (new SlackMessage)
                    ->headline('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->content('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
```

To customize the content of the message with the right information for the organizer, we need to pass the meetup and the guest information to the *NewMeetupSignup* notification class:

Now we can customize the message for the notification:

```php
class NewMeetupSignup extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Meetup $meetup,
        public Guest $guest
    ){}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject("New guest for {$this->meetup->title}")
                    ->line("{$this->guest->name} ({$this->guest->email}) has registered for the meetup.");
    }
}
```

We now have the notification message to notify meetup's organizer for the new attendee.

The only thing that you need in your **Organizer** model is the framework's built-in **Illuminate\\Notifications\\Notifiable** trait. This trait will add the notify() method to your model so you can send notification to the entity.

```php
class Organizer extends Model
{
    use Notifiable;
}
```

Here is the controller that sends this notification:

```php
class MeetupController extends Controller
{
    public function newAttendee(Request $request)
    {
        $request->validate([
            'meetup_id' => 'required',
            'name' => 'required',
            'email' => 'required|email',
        ]);

        $meetup = Meetup::findOrFail($request->meetup_id);

        $guest = $meetup->guests()->create([$request->only('name', 'email')]);

        /*
         * Here is where the notification is sent.
         */
        $meetup->organizer->notify(
            new NewMeetupSignup($meetup, $guest)
        );

        return view('meetup', compact('meetup'));
    }
}
```

You could use the Notifiable trait in any model you want to add this feature. For example I use it in the Organization and User model. They both have the email address field, so I can send them email notifications with easy.

Notifications are really helpful because you can change the medium from email to SMS for example, even giving the users the option to choose the best communication channel they prefer.

If, for some specific need we decide to don't offer other communication channels email, we can directly use Mailable class to set up email notifications.

Let's create a new email in Laravel:

```bash
php artisan make:mail SignupConfirm
```

The new class will be placed into `app/Mail/SignupConfirm.php` file. The most important method is envelope where we configured the real message.

```php
class SignupConfirm extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct()
    {
        //...
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Signup Confirm"
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.signup'
        );
    }
}
```

To create the content of the message we maybe need to pass some information to this mailable class, like the meetup name, or other details. We can do it in the constructor.

```php
class SignupConfirm extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $meetupName,
        public string $userName
    )
    {
        //...
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Signup Confirm"
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.signup'
        );
    }
}
```

Remember, all the public properties in the mailable class will be automatically available in the markdown view.

You have plenty of options to customize the markdown content, like panels, table, etc, thanks to the Laravel blade system. See [Mailable documentation](https://laravel.com/docs/master/mail#writing-markdown-messages).

```php
@component('mail::message')

# You are registered for {{$meetupName}}

Hello {{$userName}}, your are now an attendee of this new exiting meetup.

Thanks,

{{config('app.name')}}
@endcomponent
```

To send this email we need to change a bit the code into the controller using the Laravel Mail service:

```php
class MeetupController extends Controller
{
    public function newAttendee(Request $request)
    {
        $request->validate([
            'meetup_id' => 'required',
            'name' => 'required',
            'email' => 'required|email',
        ]);

        $meetup = Meetup::findOrFail($request->meetup_id);

        $guest = $meetup->guests()->create([$request->only('name', 'email')]);

        /*
         * Notify the organizer
         */
        $meetup->organizer->notify(
            new NewMeetupSignup($meetup, $guest)
        );

        /*
         * Sending the Email to the guest
         */
        Mail:to($guest->email)->send(new SignupConfirm($meetup->name, $guest->name));

        return view('meetup', compact('meetup'));
    }
}
```

I hope it was an helpful article to better understand these features.
