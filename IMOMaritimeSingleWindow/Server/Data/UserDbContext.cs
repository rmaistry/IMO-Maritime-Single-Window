
using System;
using IMOMaritimeSingleWindow.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IMOMaritimeSingleWindow.Extensions;
using IMOMaritimeSingleWindow.Helpers;

namespace IMOMaritimeSingleWindow.Data
{
    public class UserDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {

        public DbSet<Person> Person { get; set; }
        public DbSet<Password> Password { get; set; }

        public UserDbContext() { } /* Required for migrations */

        public UserDbContext(DbContextOptions<UserDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("User");
            builder.Entity<ApplicationRole>().ToTable("Role");
            builder.Entity<ApplicationUserRole>().ToTable("ApplicationUserRole");
            builder.Entity<ApplicationUserRole>().Property(ur => ur.RoleId).HasColumnName("ApplicationRoleId");
            builder.Entity<ApplicationUserRole>().Property(ur => ur.UserId).HasColumnName("ApplicationUserId");

            builder.Entity<ApplicationUserToken>().ToTable("ApplicationUserToken");
            builder.Entity<ApplicationUserLogin>().ToTable("ApplicationUserLogin");
            builder.Entity<ApplicationRoleClaim>().ToTable("ApplicationRoleRight");
            builder.Entity<ApplicationUserClaim>().ToTable("ApplicationUserRight"); //To be coupled through role?

            builder.Entity<ApplicationUser>().Ignore(entity => entity.PasswordHash);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                // Replace table names
                var entityName = RenameTables.RenameName(entity.Relational().TableName);
                entity.Relational().TableName = entityName.ToSnakeCase();

                // Replace column names            
                foreach (var property in entity.GetProperties())
                {
                    var name = RenameTables.RenameName(property.Name);
                    property.Relational().ColumnName = name.ToSnakeCase();
                }

                foreach (var key in entity.GetKeys())
                {
                    var keyName = RenameTables.RenameName(key.Relational().Name);
                    key.Relational().Name = keyName.ToSnakeCase();
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    var keyName = RenameTables.RenameName(key.Relational().Name);
                    key.Relational().Name = keyName.ToSnakeCase();
                }

                foreach (var index in entity.GetIndexes())
                {
                    var indexName = RenameTables.RenameName(index.Relational().Name);
                    index.Relational().Name = indexName.ToSnakeCase();
                }
            }


            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);


            //builder.Entity<ApplicationUser>(entity => entity.ToTable(name: "ApplicationUser" ));
            //builder.Entity<ApplicationRole>(entity => entity.ToTable(name: "ApplicationRole"));
            //builder.Entity<ApplicationUserRole>(entity => entity.ToTable(name: "ApplicationUserRole"));
            //builder.Entity<ApplicationUserToken>(entity => entity.ToTable(name: "ApplicationUserToken"));
            //builder.Entity<ApplicationUserLogin>(entity => entity.ToTable(name: "ApplicationUserLogin"));
            //builder.Entity<ApplicationRoleClaim>(entity => entity.ToTable(name: "ApplicationRoleClaim"));
            //builder.Entity<ApplicationUserClaim>(entity => entity.ToTable(name: "ApplicationUserClaim"));



            
            

            /*
            builder.Entity<ApplicationUser>().ToTable(nameof(ApplicationUser));
            builder.Entity<ApplicationRole>().ToTable(nameof(ApplicationRole));
            builder.Entity<ApplicationUserRole>().ToTable(nameof(ApplicationUserRole));
            builder.Entity<ApplicationUserToken>().ToTable(nameof(ApplicationUserToken));
            builder.Entity<ApplicationUserLogin>().ToTable(nameof(ApplicationUserLogin));
            builder.Entity<ApplicationRoleClaim>().ToTable(nameof(ApplicationRoleClaim));
            builder.Entity<ApplicationUserClaim>().ToTable(nameof(ApplicationUserClaim)); //To be coupled through role?
            */
            
                
        }
    }
}
