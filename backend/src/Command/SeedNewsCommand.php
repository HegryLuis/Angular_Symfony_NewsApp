<?php

namespace App\Command;

use App\Entity\News;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-news',
    description: 'Fills the database with sample news articles',
)]
class SeedNewsCommand extends Command
{
        public function __construct(private EntityManagerInterface $entityManager)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $io->info('Starting to seed news articles...');

        $newsData = [
            ['title' => 'Angular 17 Released!', 'content' => 'Very interesting content'],
            ['title' => 'Symfony ', 'content' => 'Very interesting content'],
            ['title' => 'Docker', 'content' => 'Very interesting content'],
            ['title' => 'Another new Nginx', 'content' => 'Very interesting content'],
            ['title' => 'RxJS', 'content' => 'Very interesting content'],
        ];

        $count = 0;
        foreach ($newsData as $data) {
            $news = new News();
            $news->setTitle($data['title']);
            $news->setContent($data['content']);
            $newDate = (new \DateTimeImmutable())->modify("-{$count} days");
            $news->setCreatedAt($newDate);

            $this->entityManager->persist($news);
            $count++;
        }

        $this->entityManager->flush();

        $io->success(sprintf('Successfully seeded %d news articles.', $count));

        return Command::SUCCESS;
    }

}
