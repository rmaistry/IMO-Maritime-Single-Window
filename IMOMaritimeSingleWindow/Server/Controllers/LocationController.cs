using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IMOMaritimeSingleWindow.Data;
using IMOMaritimeSingleWindow.Models;
using IMOMaritimeSingleWindow.Helpers;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace IMOMaritimeSingleWindow.Controllers
{
    [Route("api/[controller]")]
    public class LocationController : Controller
    {
        readonly open_ssnContext _context;

        public LocationController(open_ssnContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult RegisterLocation([FromBody] Location newLocation)
        {
            try
            {
                _context.Location.Add(newLocation);
                _context.SaveChanges();
            } catch (Exception e) {
                return BadRequest(e.Message + ":\n" + e.InnerException.Message);
            }
            return Ok(newLocation);
        }

        public List<Location> SearchLocation(string searchTerm)
        {
            return (from loc in _context.Location
                            where (EF.Functions.ILike(loc.LocationName, searchTerm + '%')
                            || EF.Functions.ILike(loc.LocationCode, searchTerm + '%'))
                            && loc.LocationCode != null && !loc.LocationCode.Equals(string.Empty)
                            select loc).Take(10).ToList();
        }

        [HttpGet("search/{searchTerm}")]
        public JsonResult SearchLocationJson(string searchTerm)
        {
            List<Location> results = SearchLocation(searchTerm);
            
            List<LocationSearchResult> resultList = new List<LocationSearchResult>();
            foreach(Location loc in results)
            {
                
                LocationSearchResult searchItem = new LocationSearchResult();
                searchItem.LocationId = loc.LocationId;
                searchItem.LocationName = (loc.LocationName != null) ? loc.LocationName : string.Empty;
                searchItem.LocationCode = (loc.LocationCode != null) ? loc.LocationCode : string.Empty;

                resultList.Add(searchItem);
            }
            return Json(resultList);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            Location location = _context.Location.FirstOrDefault(loc => loc.LocationId == id);
            if (location == null)
            {
                return BadRequest();
            }
            return Json(location);
        }
    }
}