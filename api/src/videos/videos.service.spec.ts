import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideosService } from './videos.service';
import { Video, Difficulty } from './entities/video.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { HttpService } from '@nestjs/axios';

describe('VideosService', () => {
  let service: VideosService;
  let videoRepository: Repository<Video>;
  let categoryRepository: Repository<Category>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    videoRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all videos without filters', async () => {
      const mockVideos = [{ id: 1, title: 'Video1' }] as Video[];
      jest.spyOn(videoRepository, 'find').mockResolvedValue(mockVideos);

      const result = await service.findAll();

      expect(result).toEqual(mockVideos);
      expect(videoRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['categories'],
      });
    });

    it('should filter videos by difficulty', async () => {
      const mockVideos = [
        { id: 1, title: 'Video1', difficulty: Difficulty.Beginner },
      ] as Video[];
      jest.spyOn(videoRepository, 'find').mockResolvedValue(mockVideos);

      const result = await service.findAll(Difficulty.Beginner);

      expect(result).toEqual(mockVideos);
      expect(videoRepository.find).toHaveBeenCalledWith({
        where: { difficulty: Difficulty.Beginner },
        relations: ['categories'],
      });
    });

    it('should filter videos by category', async () => {
      const mockVideos = [{ id: 1, title: 'Video1' }] as Video[];
      jest.spyOn(videoRepository, 'find').mockResolvedValue(mockVideos);

      const result = await service.findAll(undefined, 'Category1');

      expect(result).toEqual(mockVideos);
      expect(videoRepository.find).toHaveBeenCalledWith({
        where: { categories: { name: 'Category1' } },
        relations: ['categories'],
      });
    });

    it('should filter videos by both difficulty and category', async () => {
      const mockVideos = [{ id: 1, title: 'Video1' }] as Video[];
      jest.spyOn(videoRepository, 'find').mockResolvedValue(mockVideos);

      const result = await service.findAll(Difficulty.Beginner, 'Category1');

      expect(result).toEqual(mockVideos);
      expect(videoRepository.find).toHaveBeenCalledWith({
        where: {
          difficulty: Difficulty.Beginner,
          categories: { name: 'Category1' },
        },
        relations: ['categories'],
      });
    });
  });

  describe('create', () => {
    it('should create a video with categories', async () => {
      const createVideoDto: CreateVideoDto = {
        title: 'Test Video',
        description: 'Test Description',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        difficulty: Difficulty.Beginner,
        categories: ['Category1', 'Category2'],
      };

      const mockCategories = [
        { id: 1, name: 'Category1' },
        { id: 2, name: 'Category2' },
      ] as Category[];

      const mockVideo = {
        id: 1,
        ...createVideoDto,
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        categories: mockCategories,
      } as Video;

      jest.spyOn(videoRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(mockCategories);
      jest.spyOn(videoRepository, 'create').mockReturnValue(mockVideo);
      jest.spyOn(videoRepository, 'save').mockResolvedValue(mockVideo);

      const result = await service.create(createVideoDto);

      expect(result).toEqual(mockVideo);
      expect(videoRepository.findOne).toHaveBeenCalledWith({
        where: { youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      });
      expect(categoryRepository.find).toHaveBeenCalledWith({
        where: [{ name: 'Category1' }, { name: 'Category2' }],
      });
      expect(videoRepository.create).toHaveBeenCalledWith({
        title: 'Test Video',
        description: 'Test Description',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        difficulty: Difficulty.Beginner,
      });
      expect(videoRepository.save).toHaveBeenCalledWith(mockVideo);
    });

    it('should throw error if video already exists', async () => {
      const createVideoDto: CreateVideoDto = {
        title: 'Test Video',
        description: 'Test Description',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        difficulty: Difficulty.Beginner,
        categories: ['Category1'],
      };

      const existingVideo = {
        id: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      } as Video;

      jest.spyOn(videoRepository, 'findOne').mockResolvedValue(existingVideo);

      await expect(service.create(createVideoDto)).rejects.toThrow(
        'Video already exists',
      );
    });

    it('should throw error if categories do not exist', async () => {
      const createVideoDto: CreateVideoDto = {
        title: 'Test Video',
        description: 'Test Description',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        difficulty: Difficulty.Beginner,
        categories: ['Category1', 'Category2'],
      };

      jest.spyOn(videoRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValue([{ id: 1, name: 'Category1' }] as Category[]);

      await expect(service.create(createVideoDto)).rejects.toThrow(
        'The following categories do not exist: Category2',
      );
    });
  });
});
