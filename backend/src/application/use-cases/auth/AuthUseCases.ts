import { IUserRepository, IRestaurantRepository } from '../../../core/repositories';
import { PasswordHasher } from '../../../infrastructure/security/PasswordHasher';
import { TokenService } from '../../../infrastructure/security/TokenService';
import { AppError, ConflictError, UnauthorizedError, NotFoundError } from '../../../core/errors/AppError';

export class AuthUseCases {
  constructor(
    private userRepository: IUserRepository,
    private restaurantRepository: IRestaurantRepository
  ) {}

  public async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Geçersiz e-posta veya şifre.');
    }

    const isValid = await PasswordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Geçersiz e-posta veya şifre.');
    }

    let restaurant = null;
    if (user.restaurantId) {
      restaurant = await this.restaurantRepository.findById(user.restaurantId);
    }

    const token = TokenService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      restaurant,
    };
  }

  public async registerRestaurant(data: {
    userName: string;
    email: string;
    password: string;
    restaurantName: string;
    restaurantSlug: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Bu e-posta adresi ile kayıtlı bir kullanıcı zaten mevcut.');
    }

    const existingSlug = await this.restaurantRepository.findBySlug(data.restaurantSlug);
    if (existingSlug) {
      throw new ConflictError('Bu restoran kısa adı (slug) zaten kullanımda.');
    }

    const newRestaurant = await this.restaurantRepository.create({
      slug: data.restaurantSlug.toLowerCase().trim(),
      name: data.restaurantName,
      tagline: 'Lezzet ve Keyif Dolu Anlar',
      primaryColor: '#e11d48',
      accentColor: '#f59e0b',
      themeMode: 'dark',
      fontFamily: 'Inter',
      wifiEncryption: 'WPA',
      wifiHidden: false,
      currency: '₺',
      languageDefault: 'tr',
      isActive: true,
    });

    const passwordHash = await PasswordHasher.hash(data.password);
    const newUser = await this.userRepository.create({
      email: data.email,
      name: data.userName,
      passwordHash,
      role: 'RESTAURANT_OWNER',
      restaurantId: newRestaurant.id,
    });

    const token = TokenService.sign({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      restaurantId: newRestaurant.id,
    });

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      restaurant: newRestaurant,
    };
  }

  public async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı.');
    }

    let restaurant = null;
    if (user.restaurantId) {
      restaurant = await this.restaurantRepository.findById(user.restaurantId);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      restaurant,
    };
  }
}
