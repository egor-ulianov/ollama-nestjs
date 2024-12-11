import { Test, TestingModule } from '@nestjs/testing';
import { OllamaGeneratorService } from './ollama-generator.service';

describe('OllamaGeneratorService', () => {
  let service: OllamaGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OllamaGeneratorService],
    }).compile();

    service = module.get<OllamaGeneratorService>(OllamaGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
