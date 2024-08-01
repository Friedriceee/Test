﻿using Microsoft.EntityFrameworkCore;
using Oracle.EntityFrameworkCore;
using takeout_tj.Models.Merchant;
using takeout_tj.Models.Platform;
using takeout_tj.Models.User;

namespace takeout_tj.Data
{
	public class ApplicationDbContext : DbContext
	{
		public DbSet<UserDB> Users { get; set; }
		public DbSet<UserAddressDB> UserAddresses { get; set; }
		public DbSet<MembershipDB> Memberships { get; set; }
		public DbSet<MerchantDB> Merchants { get; set; }
		
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
		{
		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			base.OnConfiguring(optionsBuilder);
			if(!optionsBuilder.IsConfigured)
			{

			}
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<UserDB>().HasKey(u => u.UserId);
			modelBuilder.Entity<UserAddressDB>().HasKey(u => new {u.UserId, u.UserAddress});
			modelBuilder.Entity<MerchantDB>().HasKey(m => m.MerchantId);
			modelBuilder.Entity<FavoriteMerchantDB>().HasKey(um => new {um.UserId, um.MerchantId});
			modelBuilder.Entity<DishDB>().HasKey(d => new { d.MerchantId, d.DishId });
			modelBuilder.Entity<ShoppingCartDB>().HasKey(s => new {s.UserId, s.MerchantId, s.DishId, s.ShoppingCartId});
			modelBuilder.Entity<CouponDB>().HasKey(c => c.CouponId);
			modelBuilder.Entity<CouponPurchaseDB>().HasKey(c => c.CouponPurchaseId);
			modelBuilder.Entity<UserCouponDB>().HasKey(u => new { u.UserId, u.CouponId, u.ExpirationDate });
			
			// 定义地址到用户的多对一关系
			modelBuilder.Entity<UserAddressDB>()
				.HasOne(a => a.UserDB)
				.WithMany(u => u.UserAddressDBs)
				.HasForeignKey(a => a.UserId);
			modelBuilder.Entity<MembershipDB>().HasKey(m => m.UserId);
			modelBuilder.Entity<MembershipDB>()
				.HasOne(m => m.UserDB)
				.WithOne()
				.HasForeignKey<MembershipDB>(m => m.UserId);
			// 用户收藏商家的多对多联系集
			modelBuilder.Entity<FavoriteMerchantDB>()
				.HasOne(um => um.UserDB)
				.WithMany(u => u.FavoriteMerchantDBs)
				.HasForeignKey(um => um.UserId);
			modelBuilder.Entity<FavoriteMerchantDB>()
				.HasOne(um => um.MerchantDB)
				.WithMany(m => m.FavoriteMerchantDBs)
				.HasForeignKey(um => um.MerchantId);
			// 定义菜品与商家的多对一联系
			modelBuilder.Entity<DishDB>()
				.HasOne(d => d.MerchantDB)
				.WithMany(m => m.DishDBs)
				.HasForeignKey(d => d.MerchantId);
			// 定义购物车项与用户的多对一联系
			modelBuilder.Entity<ShoppingCartDB>()
				.HasOne(s => s.UserDB)
				.WithMany(u => u.shoppingCartDBs)
				.HasForeignKey(s => s.UserId);
			// 定义购物车项与菜品的多对一联系
			modelBuilder.Entity<ShoppingCartDB>()
				.HasOne(s => s.DishDB)
				.WithMany(d => d.ShoppingCartDBs)
				.HasForeignKey(s => new { s.MerchantId, s.DishId });
			// 定义优惠券购买订单与优惠券的多对一联系
			modelBuilder.Entity<CouponPurchaseDB>()
				.HasOne(p => p.CouponDB)
				.WithMany(c => c.CouponPurchaseDBs)
				.HasForeignKey(p => p.CouponId);
			// 用户拥有优惠券的多对多联系集
			modelBuilder.Entity<UserCouponDB>()
				.HasOne(uc => uc.UserDB)
				.WithMany(u => u.UserCouponDBs)
				.HasForeignKey(uc => uc.UserId);
			modelBuilder.Entity<UserCouponDB>()
				.HasOne(uc => uc.CouponDB)
				.WithMany(c => c.UserCouponDBs)
				.HasForeignKey(uc => uc.CouponId);

			modelBuilder.Entity<DishDB>()
				.Property(d => d.DishPrice)
				.HasColumnType("numeric(10,2)");
			modelBuilder.Entity<CouponDB>()
				.Property(c => c.CouponValue)
				.HasColumnType("numeric(10,2)");
			modelBuilder.Entity<CouponDB>()
				.Property(c => c.CouponPrice)
				.HasColumnType("numeric(10,2)");
			modelBuilder.Entity<CouponDB>()
				.Property(c => c.MinPrice)
				.HasColumnType("numeric(10,2)");
				
			modelBuilder.Entity<UserDB>().ToTable("users");
			modelBuilder.Entity<UserAddressDB>().ToTable("user_address");
			modelBuilder.Entity<MembershipDB>().ToTable("memberships");
			modelBuilder.Entity<MerchantDB>().ToTable("merchants");
			modelBuilder.Entity<FavoriteMerchantDB>().ToTable("favorite_merchants");
			modelBuilder.Entity<DishDB>().ToTable("dishes");
			modelBuilder.Entity<ShoppingCartDB>().ToTable("shoppingcarts");
			modelBuilder.Entity<CouponDB>().ToTable("coupons");
			modelBuilder.Entity<CouponPurchaseDB>().ToTable("coupon_purchases");
			modelBuilder.Entity<UserCouponDB>().ToTable("user_coupons");
		}
	}
}
