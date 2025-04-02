import { plainToInstance } from 'class-transformer';
import { CandidateDto, CandidateResponseDto } from '@work-whiz/dtos';
import { ICandidate } from '@work-whiz/interfaces';

export class CandidateTransformer {
  static toDto(candidate: Partial<ICandidate>): CandidateDto {
    return plainToInstance(CandidateDto, candidate, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    });
  }

  static toResponseDto(candidate: Partial<ICandidate>): CandidateResponseDto {
    return plainToInstance(CandidateResponseDto, candidate, {
      excludeExtraneousValues: true,
    });
  }
}
