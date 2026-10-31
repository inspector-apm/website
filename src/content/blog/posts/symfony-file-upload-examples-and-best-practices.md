---
title: "Symfony file upload examples and best practices"
slug: "symfony-file-upload-examples-and-best-practices"
section: "inspector"
permalink: "/symfony-file-upload-examples-and-best-practices/"
original_url: "https://inspector.dev/symfony-file-upload-examples-and-best-practices/"
date: "2024-12-10T18:16:11Z"
updated: "2025-02-04T12:17:52Z"
author: "Valerio Barbera"
category: "Application monitoring"
categories: ["Application monitoring"]
tags: []
excerpt: "Learn best practices for secure and efficient file uploads in Symfony, including validation, storage, and custom handling techniques."
description: "Learn best practices for secure and efficient Symfony file upload, including validation, storage, and custom handling techniques."
focus_keyword: "symfony file upload"
featured_image: "../images/symfony-file-upload-examples-and-best-practices/featured.jpg"
wp_id: 7891
---

**Uploading files in** [**Symfony**](https://symfony.com/) **can be simple and secure if done right.** The framework offers different ways to handle file upload: use Symfony Form component, or working directly with the HTTP request.

To better understand the details of uploading a file into a Symfony backend I’ll show you the raw implementation first.

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or [**X**](https://x.com/Barbalerio) to stay updated for new articles.

## Step-by-Step Guide to File Uploads in Symfony

I always prefer to start implementing my application features starting from the UI to maintain my focus on the user experience.

Using twig you can easily implement a simple HTTP form template with a file input field:

```html
{# templates/file_upload/upload.html.twig #}
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Upload File</h1>

    {% for message in app.flashes('success') %}
        <div class="alert alert-success">{{ message }}</div>
    {% endfor %}
    {% for message in app.flashes('error') %}
        <div class="alert alert-danger">{{ message }}</div>
    {% endfor %}

    <form action="{{ path('file_upload') }}" method="post" enctype="multipart/form-data">
        <div>
            <label for="file">Choose a file:</label>
            <input type="file" name="file" id="file" required>
        </div>
        <button type="submit">Upload</button>
    </form>
{% endblock %}
```

Below an example of the Controller class that define the route to access this view:

```php
<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FileUploadController extends AbstractController
{
    #[Route('/upload', name: 'file_upload_form', methods: ['GET'])]
    public function uploadForm(Request $request): Response
    {
        return $this->render('file_upload/upload.html.twig');
    }
}
```

### Configure Upload Directory

Ensure the **public/uploads** directory exists and is writable:

```
mkdir -p public/uploads
chmod 775 public/uploads
```

You can also add **public/uploads** folder to your `.gitignore` file to be sure uploaded files in your local environment are not committed into the repository.

### Setup the Controller

The HTML form is configured to send a POST request to the “file_upload” route. Here is the implementation of the controller that handle this request.

```php
<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileUploadController extends AbstractController
{
    #[Route('/upload', name: 'file_upload_form', methods: ['GET'])]
    public function uploadForm(Request $request): Response
    {
        return $this->render('file_upload/upload.html.twig');
    }

    #[Route('/upload', name: 'file_upload', methods: ['POST']))]
    public function upload(Request $request): Response
    {
        // Get the file from the request
        $uploadedFile = $request->files->get('file');

        if ($uploadedFile) {
            $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/uploads';
            $filename = uniqid() . '.' . $uploadedFile->guessExtension();

            try {
                $uploadedFile->move($uploadsDirectory, $filename);
            } catch (FileException $e) {
                $this->addFlash('error', 'Failed to upload file: ' . $e->getMessage());
                return $this->redirectToRoute('file_upload_form');
            }

            $this->addFlash('success', 'File uploaded successfully!');
        } else {
            $this->addFlash('error', 'No file selected.');
        }

        return $this->redirectToRoute('file_upload_form');
    }
}
```

Notice that during the process I create a new filename based on a unique ID. This helps to avoid files with same name at disk level. You can eventually store the original file metadata into the database to allow the user view its original information.

We’ll explore this option below in the article.

### Symofny advanced file validation

In a real world scenario you should introduce more validation checks to be sure the file your users are uploading are what you expect.

Here is an example of how you can check the file type and its size before proceeding to store it.

```php
if ($uploadedFile->getSize() > 2000*1024) { // 2 MB limit
    $this->addFlash('error', 'File is too large.');
    return $this->redirectToRoute('file_upload_form');
}

$allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
    $this->addFlash('error', 'Invalid file type.');
    return $this->redirectToRoute('file_upload_form');
}
```

## Use [Symfony Form](https://symfony.com/doc/current/components/form.html) component to handle file upload

As mentioned at the beginning of the article there is a specific extension to handle file upload in Symfony in OOP way. It’s absolutely required in my opinion if you are building an app where file upload is a key feature. Maybe because you want to manage big files, or many different type of files. In general for more advanced needs it allows you to decouple different parts of the uploading process so you can maintain them without impacting the rest of your code.

### Install Symfony Form Component

The Form component ships as a separated package and it is not included in the framework bundle by default.

Run the command below to install the Form component:

```
composer require symfony/form
```

### Creating a Simple File Upload

The first step is to create a class to define the fields of the form. In this case we create a simple form with only one field (the file type field):

```php
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\File;

class DocumentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('file', FileType::class, [
                'label' => 'Document (PDF file)',
                'constraints' => [
                    new File([
                        'maxSize' => '1024k',
                        'mimeTypes' => [
                            'application/pdf',
                            'application/x-pdf',
                        ],
                        'mimeTypesMessage' => 'Please upload a valid PDF document',
                    ])
                ],
            ])
        ;
    }
}
```

Notice that in the field definition you can already setup the validation rules (constraints) that will be automatically checked on the form submission.

To handle the uploaded file, use the following controller:

```php
class FileUploadController extends AbstractController
{
    #[Route('/upload', name: 'document_upload', method: ['POST'])]
    public function upload(Request $request, FileUploader $fileUploader): Response
    {
        // The form component will handle the request based on the type definition.
        $form = $this->createForm(DocumentType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $file = $form->get('file')->getData();
                $fileName = $fileUploader->upload($file);

                $this->addFlash('success', 'File has been uploaded successfully');
                return $this->redirectToRoute('document_list');
            } catch (FileException $e) {
                $this->addFlash('error', 'An error occurred while uploading the file');
            }
        }

        return $this->render('document/upload.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
```

This works well for straightforward use cases. However, for more complex requirements, it's better to create a dedicated service for managing file uploads.

### Using Advanced File Upload Methods

To make file handling more reusable and organized, you can create a dedicated service like this:

```php
class FileUploader
{
    private string $targetDirectory;
    private SluggerInterface $slugger;

    public function __construct(string $targetDirectory, SluggerInterface $slugger)
    {
        $this->targetDirectory = $targetDirectory;
        $this->slugger = $slugger;
    }

    public function upload(UploadedFile $file): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = sprintf('%s-%s.%s', 
            $safeFilename,
            uniqid(),
            $file->guessExtension()
        );

        try {
            $file->move(
                $this->getTargetDirectory(),
                $fileName
            );
        } catch (FileException $e) {
            throw new FileUploadException('Failed to upload file: ' . $e->getMessage());
        }

        return $fileName;
    }

    public function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }
}
```

Remember to check out the PHP settings in your `php.ini` file to avoid unexpected issues:

| Configuration | Default Value | Purpose |
| --- | --- | --- |
| `upload_max_filesize` | 2M | Maximum file size allowed |
| `post_max_size` | 8M | Maximum POST request size |
| `memory_limit` | 256M | Memory usage limit for PHP |

## Ensuring Secure File Uploads

### Key Security Practices for File Uploads

To ensure uploaded file respect your application constraints you can combine validation and safe storage techniques. Symfony's validation constraints help ensure files are processed securely.

```php
use Symfony\Component\Validator\Constraints as Assert;

class Document
{
    #[Assert\File(
        maxSize: '5M',
        mimeTypes: ['application/pdf', 'application/x-pdf'],
        mimeTypesMessage: 'Please upload a valid PDF document',
        notFoundMessage: 'The file could not be found',
        notReadableMessage: 'The file is not readable'
    )]
    private $file;
}
```

To streamline secure file handling, consider using a dedicated service like `SecureFileHandler`. This service validates MIME types and creates unique filenames to prevent conflicts:

```php
class SecureFileHandler
{
    private string $uploadDir;
    private array $allowedMimeTypes;

    public function __construct(string $uploadDir, array $allowedMimeTypes)
    {
        $this->uploadDir = $uploadDir;
        $this->allowedMimeTypes = $allowedMimeTypes;
    }

    public function handleUpload(UploadedFile $file): string
    {
        if (!in_array($file->getMimeType(), $this->allowedMimeTypes)) {
            throw new SecurityException('Invalid file type');
        }

        $fileName = bin2hex(random_bytes(16)) . '.' . $file->guessExtension();
        $file->move($this->uploadDir, $fileName);

        return $fileName;
    }
}
```

Best practices for file uploads include:

- Validating file types and sizes
- Storing files outside the web root
- Generating unique filenames to avoid overwrites

These steps add layers of protection to your application [<sup>\[1\]</sup>](https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html).

### Storing File Metadata with [Doctrine](https://www.doctrine-project.org/projects/orm.html)

![Doctrine](../images/symfony-file-upload-examples-and-best-practices/www.doctrine-project.org-831fa96ef7a44fbd879dd682cd0c1432.jpg)

Storing metadata for uploaded files provides better tracking and ensures data integrity. Below is an example of a Doctrine entity for metadata storage:

```php
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class FileMetadata
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $originalFilename;

    #[ORM\Column(type: 'string', length: 255)]
    private $storedFilename;

    #[ORM\Column(type: 'string', length: 100)]
    private $mimeType;

    #[ORM\Column(type: 'datetime')]
    private $uploadedAt;
}
```

In your controller, you can implement metadata storage like this:

```php
#[Route('/upload', name: 'file_upload')]
public function upload(
    Request $request, 
    SecureFileHandler $fileHandler,
    EntityManagerInterface $entityManager
): Response
{
    $file = $request->files->get('file');

    try {
        $storedFilename = $fileHandler->handleUpload($file);

        $metadata = new FileMetadata();
        $metadata->setOriginalFilename($file->getClientOriginalName());
        $metadata->setStoredFilename($storedFilename);
        $metadata->setMimeType($file->getMimeType());
        $metadata->setUploadedAt(new \DateTime());

        $entityManager->persist($metadata);
        $entityManager->flush();

        return new JsonResponse(['success' => true]);
    } catch (SecurityException $e) {
        return new JsonResponse(['error' => $e->getMessage()], 400);
    }
}
```

This method not only secures file uploads but also makes it easier to track and manage uploaded files effectively [<sup>\[1\]</sup>](https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html)[<sup>\[2\]</sup>](https://symfony.com/doc/current/controller/upload_file.html).

## Handling Complex File Upload Requirements

### Uploading Multiple Files in Symfony

Symfony makes it straightforward to handle single file uploads, but when dealing with multiple files, you need a clear and structured method. Here's how you can set up a form type for multiple file uploads:

```php
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class MultipleFileUploadType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('files', CollectionType::class, [
                'entry_type' => FileType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'prototype' => true,
            ])
        ;
    }
}
```

This form type uses `CollectionType` to handle multiple file inputs, enabling dynamic addition and deletion of files.

To process these files, you can use a handler service like the one below:

```php
class MultipleFileHandler
{
    private $uploadDir;
    private $entityManager;

    public function processFiles(array $files): array
    {
        $processedFiles = [];
        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $fileName = $this->generateUniqueFileName($file);
            $file->move($this->uploadDir, $fileName);

            $fileEntity = new FileEntity();
            $fileEntity->setFileName($fileName);
            $fileEntity->setOriginalName($file->getClientOriginalName());
            $fileEntity->setMimeType($file->getMimeType());

            $this->entityManager->persist($fileEntity);
            $processedFiles[] = $fileEntity;
        }

        $this->entityManager->flush();
        return $processedFiles;
    }
}
```

This service ensures each file is saved with a unique name, moved to the designated directory, and stored in the database.

### Creating Custom File Validation Rules

Custom validation rules help enforce limits on file size, accepted types, and even file content. Here's an example of how to create and apply such rules:

```php
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

#[Attribute]
class CustomFileValidation extends Constraint
{
    public int $maxSize = 5242880; // 5 MB
    public array $allowedTypes = [];
    public bool $scanContent = true;
}

class CustomFileValidator extends ConstraintValidator
{
    private $malwareScanner;

    public function validate($value, Constraint $constraint)
    {
        if (!$value instanceof UploadedFile) {
            return;
        }

        if ($value->getSize() > $constraint->maxSize) {
            $this->context->buildViolation('File exceeds maximum size of {size} MB')
                ->setParameter('{size}', $constraint->maxSize / (1024 * 1024))
                ->addViolation();
            return;
        }

        if (!$this->isContentValid($value)) {
            $this->context->buildViolation('File content validation failed')
                ->addViolation();
        }
    }

    private function isContentValid(UploadedFile $file): bool
    {
        return $this->malwareScanner->scan($file);
    }
}
```

You can then apply this validation to an entity:

```php
class UploadedDocument
{
    #[CustomFileValidation(
        maxSize: 5242880,
        allowedTypes: ['application/pdf', 'image/jpeg'],
        scanContent: true
    )]
    private $file;
}
```

These custom rules ensure that uploaded files meet your application's standards for security and integrity.

If you want learn more about file upload security, you can take a look at this article: [https://inspector.dev/ultimate-guide-to-php-file-upload-security/](/ultimate-guide-to-php-file-upload-security/)

## Related Blog Posts

- [5 Ways to Optimize Symfony Application Performance](/5-ways-to-optimize-symfony-application-performance/)
- [Error Pattern Recognition in PHP Applications](/error-pattern-recognition-in-php-applications/)
- [Laravel Logging: Channels and Stacks Explained](/laravel-logging-channels-and-stacks-explained/)
- [How to Automate PHP Security Patch Management](/how-to-automate-php-security-patch-management/)
