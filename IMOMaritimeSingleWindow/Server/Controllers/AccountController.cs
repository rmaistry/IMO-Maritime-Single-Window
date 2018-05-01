using System.Linq;
using System.Threading.Tasks;
using IMOMaritimeSingleWindow.Data;
using IMOMaritimeSingleWindow.Helpers;
using IMOMaritimeSingleWindow.Identity; using IMOMaritimeSingleWindow.Identity.Models;
using IMOMaritimeSingleWindow.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Person = IMOMaritimeSingleWindow.TestModels.Person;
using Password = IMOMaritimeSingleWindow.TestModels.Password;
 

namespace IMOMaritimeSingleWindow.Controllers
{
    //[Authorize]
    [Route("api/[controller]")] 
    public class AccountController : Controller
    {
        private readonly usertestContext usertestContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IMapper mapper,
            usertestContext usertestContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mapper = mapper;
            this.usertestContext = usertestContext;
        }

        //[Authorize(Roles = "admin")]
        // POST api/accounts/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterR([FromBody]RegistrationViewModel model)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdentity = _mapper.Map<ApplicationUser>(model);

            return new OkObjectResult("OK");
        }

        [Authorize(Roles = "admin")]
        // POST api/accounts/register
        [HttpPost("registerwopw")]
        public async Task<IActionResult> Register([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdentity = _mapper.Map<ApplicationUser>(model);

            var result = await _userManager.CreateAsync(userIdentity);

            //TODO: Implement functionality for sending email to user with new account

            if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

            //Create the Person associated with the ApplicationUser 
            await usertestContext.Person.AddAsync(new Person
            {
                UserId = userIdentity.Id,
                FirstName = model.FirstName,
                LastName = model.LastName
            });
            await usertestContext.SaveChangesAsync();

            return new OkObjectResult("Account created");
        }
        
        // POST api/accounts/register
        [HttpPost("registerwithpw")]
        public async Task<IActionResult> RegisterWithPassword([FromBody]RegistrationWithPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdentity = _mapper.Map<ApplicationUser>(model);

            var result = await _userManager.CreateAsync(userIdentity, model.Password);

            if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

            //Create the Person associated with the ApplicationUser 
            await usertestContext.Person.AddAsync(new Person {
                IdentityId = userIdentity.Id,
                FirstName = model.FirstName,
                LastName = model.LastName
            });
            
            await usertestContext.Password.AddAsync(new Password
            {
                UserId = userIdentity.Id,
                PasswordHash = userIdentity.PasswordHash
            });
            
            await usertestContext.SaveChangesAsync();

            return new OkObjectResult("Account created");
        }


        //[Authorize(Roles = "admin")]
        [HttpGet("getrole/all")]
        public IActionResult GetAllRoles()
        {
            var rolesQueryAble = _roleManager.Roles;
            var roles = from role in rolesQueryAble
                        select role.Name;
            
            return Json(roles);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("getrole")]
        public IActionResult GetRole()
        {
            var userClaimsPrincipal = Request.HttpContext.User;
            var role = userClaimsPrincipal.Claims
                .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
                .Select(f => f.Value);
            return Json(role);
        }

    }
}
